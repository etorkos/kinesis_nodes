var fs = require("fs"),
	Readable = require("stream").Readable,
	kinesis = require('kinesis'),
	AWS = require('aws-sdk'),
	FSM = require('./fsm.js'),
	config = require('./config.js');
// maybe makes sense to have finite state machines (active, broken connection, recovery)
// recieves data on 

var producer = function () { }

	function sendData (data){
		if (typeof data !== object){

		}
	}
	function getRandomIntInclusive(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var readable = new Readable({objectMode: true});
	readable._read = function (){
		for(var a=0; a<4000; a++){
			var temp = { "building": "211 Housing", "sensor": "Sensor "+a.toString(), "value": getRandomIntInclusive(65,90), "time": new Date()}
			this.push({PartitionKey: a.toString(), Data: new Buffer(JSON.stringify(temp))});
		}
		this.push(null);
	}


	// kinesis.listStreams({region: 'us-east-1'}, function(err, streams){
	// 	if(err) throw err;
	// 	console.log(streams);
	// 	if (config.name.indexOf(streams) === -1){

	// 	}
	// })
	var testData = { "building": "211 Housing", "sensor": "Sensor 15", "value": getRandomIntInclusive(65,90), "time": new Date()};
	var test = { info: "thing" }
	FSM.start(test);
	FSM.run(test, testData);
	console.log('KIN', test);

	var kinesisStream = kinesis.stream({name: config.name, writeConcurrency: 5});

	readable.pipe(kinesisStream).on('end', function() { 
		console.log('done');
	}).on('error', function(errorObject){
		console.log("error", errorObject);
	});

// module.exports = producer;
