var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var fuzzy = require('./fuzzy.js')

var url = 'mongodb://localhost:27017/TCC';
var db;
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

  //manda para o controlador fuzzy
  var fuzzified = fuzzy.run(input)

  //cria buffer com a resposta
  var reply = Buffer.from(fuzzified.toString())

  //envia a resposta de volta para o arduino
  var PORT = rinfo.port, HOST = rinfo.address;
  server.send(reply,0, reply.length, PORT, HOST, (err, bytes) => {
  	if(err) throw err;
  	console.log("response: " + fuzzified);
  });
  //grava os valores no banco de dados
  db.collection('readings').insertOne({'data': new Date(), 'reading': input, 'pwm': fuzzified })
});

//quando o servidor começar a funcionar:
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

//servidor rodando da porta:
server.bind(5000, '192.168.0.5'); //ouvindo na porta 5000
