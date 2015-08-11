var machina = require('machina'),
	fs = require('fs'),
	kinesis = require('kinesis'),
	config = require('./config'),
	Promise = require('bluebird');



var fsm = new machina.Fsm({
	initialState: "uninitialized",
	tempData: {},
	states: {
		"uninitialized" : {
			_onEnter : function (){
				console.log('FSM uninitialized');
			}, "check": function(self){
				var isConnected = this.connectedToKinesis()
				console.log('checking...', isConnected);
				if(isConnected === 0 ) this.transition(self, 'active');
				else if (isConnected === 2) this.transition(self, 'bad-stream');
				else this.transition(self, 'disconnected');
			}, process : function (self){
				console.log("tempData", tempData)
			}
		},
		"active": {
			_onEnter: function(){
				console.log("Active Connection");
			}, "process": function(client){
				console.log('process')
				try{
					this.storeData();
					this.sendData();
				}
				catch (e) {
					console.log('Error', e);
				}	
			}, sendData: function(data){
				console.log('sending data', tempData)
			}, storeData: function(data){
				console.log('storing data', tempData)
			}, disconnect: "disconnected"
		},
		"disconnected": {
			_onEnter: function(){
				console.log("Disconnected from AWS");
			}, process : function(){

			}, storeData: function(){

			}, checkStatus: function(){
				if( this.connectedToKinesis() ) this.transition(self, 'recovery');
			}
		},
		"recovery" : {
			_onEnter: function(){
				console.log("reconnected to AWS")
			}, activateCache: function(){

			}, uploadBacklog: function(){
				// If we have files in backlog, upload
			}, makeActive: "active"
		},
		"bad-stream" : {
			_onEnter: function(){
				console.log("Specified stream does not exist");
			}
		}
	},
	connectedToKinesis : function () {
		kinesis.listStreams({region: config.region}, function(err, streams){
			console.log('kinesis check called', streams);
			if(err) Promise.reject(1); // Kinesis Error
			else if( streams.indexOf(config.name) != -1 ) Promise.reject(2); // Specified Stream not found
			else Promise.resolve();  // Kinesis connected and found stream
		})
	},
	start : function (client){
		console.log('Startup...', client);
		this.connectedToKinesis().then(function())
		
	},
	run : function (client, data){
		console.log('Run...', client);
		tempData = data;
		this.handle(client, "process");
	}
})

module.exports = fsm;

