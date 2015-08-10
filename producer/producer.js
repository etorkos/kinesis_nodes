var fs = require("fs"),
	Readable = require("stream").Readable,
	kinesis = require('kinesis'),
	AWS = require('aws-sdk');
//maybe makes sense to have finite state machines (active, broken connection, recovery)

kinesis.listStreams({region: 'us-east-1'}, function(err, streams){
	if(err) throw err;
	console.log(streams); 
})

var readable = new Readable({objectMode: true});
readable._read = function (){
	for(var a=0; a<4000; a++){
		var temp = { "building": "211 Housing", "sensor": "Sensor "+a.toString(), "value": getRandomIntInclusive(65,90), "time": new Date()}
		this.push({PartitionKey: a.toString(), Data: new Buffer(JSON.stringify(temp))});
	}
	this.push(null);
}

var config = {
  name: 'teststream',
  region: 'us-east-1',
  Bucket: 'residentialbuildings-1',
  Key: 'log1'
}

var kinesisStream = kinesis.stream({name: config.name, writeConcurrency: 5});

readable.pipe(kinesisStream).on('end', function() { 
	console.log('done');
}).on('error', function(errorObject){
	console.log("error", errorObject);
});

function getRandomIntInclusive(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

