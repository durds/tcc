var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var mongo = require('mongodb');
var assert = require('asssert');

var url = 'mongodb://localhost:27017/TCC';

mongo.connect(url, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to date base.");
});

server.on("message", function (msg, rinfo) { //every time new data arrives do this:
  console.log("server got: " + msg.readUInt16LE(0) + " from " + rinfo.address + ":" + rinfo.port); // you can comment this line out
  var reply = '';
  if(msg.readUInt16LE(0) < 500) {
  	reply = Buffer.from('h');
  } else {
  	reply = Buffer.from('l');
  }
  var PORT = rinfo.port, HOST = rinfo.address;
  server.send(reply,0, reply.length, PORT, HOST, (err, bytes) => {
  	if(err) throw err;
  	console.log("response: " + reply);
  });
  db.collection('readings').insertOne()
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(5000); //listen to udp traffic on port 6000