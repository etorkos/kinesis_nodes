var machina = require('machina'),
	fs = require('fs'),
	kinesis = require('kinesis'),
	config = require('./config'),
	Promise = require('bluebird'),
	AWS = require('aws-sdk'),
	Readable = require('stream').Readable,
	Transform = require('stream').Transform;

// thoughts, could go with a custom FSM-stream deploy, similar to 
// https://github.com/tmpvar/stream-fsm
// also may need highlandjs or RxJS for better stream control
// better to impant functionality into fsm or have outside?

var readable = new Readable({objectMode: true});
readable._read = function noImplemnetedPreventer() {};
var kinesisStream = kinesis.stream({name: config.name, writeConcurrency: 5});

var bufferify = new Transform({objectMode: true});
bufferify._transform = function(record, encoding, cb){
	console.log('bufferify',record, record.Data)
	cb(null, record.Data);
}

var fsm = new machina.Fsm({
	initialState: "uninitialized",
	tempData: [],
	myReadable: {},
	logDest: 'filelog/',
	states: {
		"uninitialized" : {
			_onEnter : function (){
				console.log('FSM uninitialized');
			}, process : function (client){
				// console.log("tempData", tempData)
			}
		},
		"active": {
			_onEnter: function(){
				console.log("Active Connection");
				// readable.pipe(kinesisStream);
				this.createKinesisReadable();
			}, "process": function(client){
				// console.log('process, active mode');
				try{
					this.sendData();
				}
				catch (e) {
					console.log('Error', e);
				}	
			}, disconnect: "disconnected"
		},
		"disconnected": {
			_onEnter: function(){
				console.log("Disconnected from AWS");
				// this.setLogPipe();
				this.createLogReadable();
			}, process : function(){
				// console.log('process, Disconnect mode')
				try{
					this.logData();
				}
				catch (e) {
					console.log('Error', e);
				}
			}, recover : "recovery"
		},
		"recovery" : {
			_onEnter: function(){
				console.log("reconnected to AWS")
				this.uploadBacklog();
			}, "process": function(client){
				// console.log('process, active mode');
				try{
					this.sendData();
				}
				catch (e) {
					console.log('Error', e);
				}	
			}, makeActive: "active"
		},
		"bad-stream" : {
			_onEnter: function(){
				console.log("Specified stream does not exist");
				//send alert over a differnt signal
			}
		}
	},
	connectedToKinesis : function () {
		// console.log('called connected to kinesis');
		return new Promise(function(resolve, reject){
			kinesis.listStreams({region: config.region}, function(err, streams){
				// console.log('kinesis check called', streams, streams.indexOf(config.name));
				if(err) reject(1); // Kinesis Error
				else if( streams.indexOf(config.name) === -1 ) reject(2); // Specified Stream not found
				else resolve(true);  // Kinesis connected and found stream
			})
		})
		
	},
	start : function (client){
		var self = this;
	 	return new Promise(function(resolve, reject){
			self.connectedToKinesis()
			.then(function(success, failure){
				// console.log('success', success, 'failure', failure);
				if (success) {
					self.transition("active");
					resolve(true);
				}
				else if (failure == 1) { 
					this.transition('disconnected');
					reject('Disconnected')
				}
				else {
					this.transition('bad-stream');
					reject('bad-stream');
				}
			})
	 	})
			
	},
	createKinesisReadable : function (){
		readable = new Readable({objectMode: true});
		readable._read = function noImplemnetedPreventer() {};
		this.myReadable = readable;
		this.myReadable.pipe(kinesisStream);
	},
	createLogReadable : function(){
		// kinesis accepts objectmode, fs does not 
		readable = new Readable();
		readable._read = function noImplemnetedPreventer() {};
		this.myReadable = readable;
		this.setLogPipe()
	},
	run : function (client, data){
		console.log('Run...', client);
		this.tempData.push(data);
		this.handle(client, "process");
	},
	setLogPipe : function() {
		var date = new Date();
		var filename = date.getDate() + '-' + date.getHours()+".txt";
		this.myReadable.pipe(fs.createWriteStream( this.logDest + filename, {flags: 'a'}));
	},
	sendData : function(){
		var mydoc = this.tempData.shift();
		// console.log('sendData',this.tempData, mydoc);
		this.myReadable.push((mydoc));
	},
	logData : function(){
		var stringifiedData = JSON.stringify(this.tempData.shift());
		// console.log('data to log', this.tempData, stringifiedData);
		this.myReadable.push(stringifiedData);
	},
	uploadBacklog : function(){
		//get all filed in folder
		console.log('in backlog upload');
		var self = this;
		fs.readdir(this.logDest, function(err, files){
			//foreach can be made async for improved speed
			console.log('open files', files);
			files.forEach(function(file){
				console.log('file', self.logDest+file);
				try{
					stream.pipe(bufferify).on('end', function(){
						try{
							//conditions file is empty
							//fs.unlink(this.logDest+file);
							console.log('delete here');
						}
						catch(e){
							console.log('delete failed');
						}
					});
				}
				catch(e){
					console.log(e);
				}
			})
			
		})
		
	},
	disconnect : function(client){
		this.transition(client, 'disconnected');
	},
	recovery: function(client){
		this.transition(client, 'recovery');
	}
})

module.exports = fsm;

