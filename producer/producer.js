// #!/usr/bin/env node
// process.stdin.pipe(FSM)
var fs = require("fs"),
	Readable = require("stream").Readable,
	Transform = require('stream').Transform,
	kinesis = require('kinesis'),
	AWS = require('aws-sdk'),
	FSM = require('./fsm.js'),
	config = require('./config.js');
// maybe makes sense to have finite state machines (active, broken connection, recovery)
// recieves data on 



	fs.readdir('filelog/', function(err, files){
		files.forEach(function(file){
			console.log('files', file);
			var fileStream = fs.createReadStream('filelog/'+file);
			fileStream.pipe(bufferify);

			// fs.readFile('filelog/'+file, function(err,data){
			// 	if (err) console.log(err);
			// 	else {
			// 		point = data.toString();
			// 		point.forEach(function(datas){
			// 			console.log('file', JSON.parse(datas));
			// 		})
					
			// 	}
			// })
		});
	});
	
	var data = [{PartitionKey: "1", Data: new Buffer(JSON.stringify({"val": 15, "time": new Date() }))}, {PartitionKey: "2", Data: new Buffer(JSON.stringify({"val": 25, "time": new Date() }))}, {PartitionKey: "3", Data: new Buffer(JSON.stringify({"val": 30, "time": new Date() }))}];
	console.log('data', data);

	var bufferify = new Transform({objectMode: true});
	bufferify._transform = function(record, encoding, cb){
		console.log('bufferify',record, record.Data)
		cb(null, record.Data);
	}



// var producer = function () { 

// 	function sendData (client, data){
// 		// expects object vs stream
// 		if (typeof data !== object){
// 			FSM.run(client, data);
// 		}
// 	}

// }

	// function getRandomIntInclusive(min, max){
	// 	return Math.floor(Math.random() * (max - min + 1)) + min;
	// }

	// var readable = new Readable({objectMode: true});
	// readable._read = function (){
	// 	for(var a=0; a<4000; a++){
	// 		var temp = { "building": "211 Housing", "sensor": "Sensor "+a.toString(), "value": getRandomIntInclusive(65,90), "time": new Date()}
	// 		this.push({PartitionKey: a.toString(), Data: new Buffer(JSON.stringify(temp))});
	// 	}
	// 	this.push(null);
	// }

	// var testData = { PartitionKey: "1", Data : new Buffer(JSON.stringify({ "building": "211 Housing", "sensor": "Sensor 15", "value": getRandomIntInclusive(65,90), "time": new Date() } )) };
	// var test = { info: "thing" }
	// FSM.start(test).then(function(success, failure){
	// 	console.log( "status", FSM.compositeState() );
	// 	FSM.run(test, testData);
	// 	setTimeout(function() {
	// 		FSM.disconnect();
	// 		// FSM.run(test, testData);
	// 	}, 1000);
	// 	setTimeout(function() {
	// 		console.log( "status", FSM.compositeState() );
	// 		FSM.run(test, testData);
	// 	}, 2000);
	// 	// FSM.disconnect();
	// 	// FSM.run(test, JSON.stringify(testData));
	// })

	// var kinesisStream = kinesis.stream({name: config.name, writeConcurrency: 5});

	// TEST FOR RAW PUMP DATA TO KINESIS
	// readable.pipe(kinesisStream).on('end', function() { 
	// 	console.log('done');
	// }).on('error', function(errorObject){
	// 	console.log("error", errorObject);
	// });
	
	// TEST FOR BASIC DATA TO STREAMS
	// var testData = { PartitionKey: "1", Data : new Buffer(JSON.stringify({ "building": "211 Housing", "sensor": "Sensor 15", "value": getRandomIntInclusive(65,90), "time": new Date() } )) };
	// readable.push(testData);
	// readable.push(null);

	// FSM.on('transition', function(data){
	// 	console.log('transition:', data);
	// })
 // module.exports = producer;
