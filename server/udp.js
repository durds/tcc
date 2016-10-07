var functions = require('./aux_func.js')
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var fuzzy = require('./fuzzy.js')
var queue = []
var url = 'mongodb://localhost:27017/TCC';
var db;
var collection = process.argv[2];
var last_pwm = 0;

mongo.connect(url, function(err, database){
  assert.equal(null, err);
  console.log("Successfully connected to date base.");
  db = database;
});

//toda vez que chegar algo do arduino:
server.on("message", function (msg, rinfo) {
  //console.log("server got: " + msg.readUInt16LE(0) + " from " + rinfo.address + ":" + rinfo.port);
  // guarda o valor da leitura de Luminosidade
  var input = msg.readUInt16LE(0)

  console.log("input: " + input)
  var PORT = rinfo.port, HOST = rinfo.address;

  if(queue.length < 10)  {
    queue.push(input)
  } else {
      var avg_input = functions.avg(queue)
      //manda para o controlador fuzzy
      var fuzzified = fuzzy.run(avg_input)
      var output = functions.proportional(last_pwm, fuzzified)

      output = Math.round(output + last_pwm)
      console.log("response: " + output);
      //cria buffer com a resposta
      var reply = Buffer.from(output.toString())

      //envia a resposta de volta para o arduino
      respond(reply, PORT, HOST)

      //grava os valores no banco de dados
      save(avg_input, output)
      queue.shift()

      last_pwm = output
  }





});

function respond (reply, PORT, HOST) {
  server.send(reply,0, reply.length, PORT, HOST, (err, bytes) => {
  	if(err) throw err;

  });
}

function save(input, fuzzified) {
  db.collection(collection).insertOne({'data': new Date(), 'reading': input, 'pwm': fuzzified }, function(err,r ) {
    assert.equal(null,err)
    console.log("inserted")
  })
}

server.on('close', function(){
  console.log("Closing.")
  db.close();
})
//quando o servidor começar a funcionar:
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

//servidor rodando da porta:
server.bind(5000, '192.168.0.5'); //ouvindo na porta 5000
