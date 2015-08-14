var Promise = require('bluebird'),
	Readable = require("stream").Readable,
	Transform = require('stream').Transform,
	Writable = require('stream').Writable,
	kinesis = require('kinesis'),
	AWS = require('aws-sdk'),
	FSM = require('./fsm.js'),
	config = require('./config.js'),
	spawn = require('child_process').spawn,
	fs = Promise.promisifyAll(require("fs"));

/*
Possible way forward
var pythonDriver = spawn('python', ['bacnet.py']);
pythonProcess.stdout.on('data', function(data) {
   console.log('stdout: ' + data);
});

pythonProcess.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

pythonProcess.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

*/
	var writable = new Writable({objectMode: true});
	writable._write = function(record, encoding, cb){
		console.log('writable',(record).toString().split(']}}'));
	}	

	// fs.readdir('filelog/', function(err, files){
	// 	var data="";
	// 	files.forEach(function(file){
	// 		return new Promise(resolve,reject){
	// 			var location = 'filelog/'+file;
	// 			console.log('files', location);
	// 			newStream = fs.createReadStream(location, {flags: 'r'});
	// 			newStream.on('data', function(chunk){
	// 				data+= chunk;
	// 			});
	// 			newStream.on('end', function(){
	// 				Promise.resolve();
	// 			});
	// 		}
	// 	});
	// });

	var data="";
	var location = 'filelog/';
	fs.readdirAsync(location).map(function(file){
		// newStream = fs.createReadStream(location+file, {flags: 'r'});
		// newStream.on('data', function(chunk){
		// 	data+= chunk;
		// });
		// newStream.on('end', function(){
		// 	return Promise.resolve();
		// });
	return fs.readFileAsync(location + file, "utf8");
	}).then(function(content){
		console.log(content);
	}).catch(function(err){
		console.log(err);
	})
	// var data = [{PartitionKey: "1", Data: new Buffer(JSON.stringify({"val": 15, "time": new Date() }))}, {PartitionKey: "2", Data: new Buffer(JSON.stringify({"val": 25, "time": new Date() }))}, {PartitionKey: "3", Data: new Buffer(JSON.stringify({"val": 30, "time": new Date() }))}];
	// console.log('data', data);

	var bufferify = new Transform({objectMode: true});
	bufferify._transform = function(record, encoding, cb){
		console.log('bufferify',record, record.Data)
		cb(null, record.Data);
	}
	// fs.createReadStream('filelog/13-16.txt', {flags: 'r'}).pipe(writable);
	// setTimeout(function(){
	// 	fs.createReadStream('filelog/13-15.txt', {flags: 'r'}).pipe(writable);	
	// },500);
	


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
