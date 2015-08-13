var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect;

var FSM = require('../fsm.js'),
	fs = require('fs');

describe('FSM Tests', function(){

	describe("Unit Tests", function(){
		
		it("FSM initialize", function(){
			expect(FSM.compositeState()).to.exist;
		});

		describe("Start tests", function(){

			beforeEach(function(){
				var test = {info : 'stuff'};
			})

			it("connected to Kinesis function resolves a promise if successful", function(done){
				FSM.connectedToKinesis().then(function(victory, defeat){
					expect(victory).to.be.true;
					done();
				})
			}); 

			it("connected to Kinesis function rejects a promise if it cannot connect", function(){

			});

			it("connected to Kinesis function rejects a promise if the requested stream is not found", function(){

			});

			it("Start works with good input and connection", function(){

			});

			it("Start fails with no connection", function(){
				// how to simulate disconnect in program?
			});

			it("Start fails with bad stream", function(){

			});

			it("create kinesis readable works", function(){

			});
		});

		describe("Active Conditions", function(){

			it("create kinesis readable creates and assigns readable", function(){

			});

			it("accepts multiple objects into the same stream", function(done){

				var testObject = { info: "thing" };
				FSM.start(testObject).then(function(success, failure){
					
					var data = [{PartitionKey: "1", Data: new Buffer(JSON.stringify({"val": 15, "time": new Date() }))}, {PartitionKey: "2", Data: new Buffer(JSON.stringify({"val": 25, "time": new Date() }))}, {PartitionKey: "3", Data: new Buffer(JSON.stringify({"val": 30, "time": new Date() }))} ];
					var err = null;
					try{
						FSM.run(testObject, data.shift());
						FSM.run(testObject, data.shift());
						FSM.run(testObject, data.shift());
					}
					catch(e){
						err = e
					}
					setTimeout(function(){
						expect(err).to.be.null;
						done();
					}, 200)
				});
				
			});

			it("SendData sends all data in Que", function(){

			});

			it("sendData handles disconnect, by reserving non-sent data, and presenting an error", function(){

			});
		});
		
		describe("Disconnect Conditions", function(){

			it("create log readable sets myReadable and calls setLogPipe", function(){

			});

			it("setLogPipe sets to the correct file", function(){

			});

			it("setLogPipe sets correct file, if no folder exists", function(){

			});

			it("LogData sends correct string, and does not override data", function(done){
				
				var testObject = { info: "thing" };
				FSM.start(testObject).then(function(success, failure){
					var err;
					console.log('started', success);
					FSM.on('transition', function(data){
						console.log('transition:', data);
					})
					FSM.disconnect(testObject);
					var data = [{PartitionKey: "1", Data: new Buffer(JSON.stringify({"val": 15, "time": new Date() }))}, {PartitionKey: "2", Data: new Buffer(JSON.stringify({"val": 25, "time": new Date() }))}, {PartitionKey: "3", Data: new Buffer(JSON.stringify({"val": 30, "time": new Date() }))}];
					try{
						FSM.run(testObject, data.shift());
						FSM.run(testObject, data.shift());
						FSM.run(testObject, data.shift());
					}
					catch(e){
						err = e;
					}
					setTimeout(function(){
						console.log('finished');
						expect(err).to.be.undefined;
						done();
					}, 200)
				});
				
			});

			it("Periodically checks server for connection", function(){

			});

			it("changes state to recovery when connection is reaquired", function(){

			});

		});
		
		it("Run adds data to tempData and calls handle(process) ", function(){

		});
		
		describe("Recovery Conditions", function(){

			it("function operates if no folder is present by emitting an error", function(){

			});

			it("mode does not change until after upload has finished", function(done){
				var testObject = { info: "thing" };
				FSM.start(testObject).then(function(success, failure){
					var err;
					console.log('started', success);
					FSM.on('transition', function(data){
						console.log('transition:', data);
					})
					FSM.recovery(testObject);
					setTimeout(function(){
						
						done();
					}, 700)
				});
			});

			it("function handles disconnect, by reserving non-sent data, and presenting an error", function(){

			});

			it("function handles empty log files, by just deleting it", function(){

			});

			it("after a file is fully read, it is deleted", function(){

			});
		});
		
		it("disconnect function correctly changes state, without changing job cache", function(){

		});
	});

	describe("Integration Tests", function(){

		it("upload to Kinesis", function(){

		});

		it("log files", function(){

		});

		it("regurgutate log", function(){

		});

		it("system breaks mid-stream", function(){

		});

		it("handles timeout from server (~5 min for kinesis)", function(){

		});

		it("data integrity with disconnect", function(){

		});

		it("upload to Kinesis works with a fast stream", function(){

		});

		it("file persists while waiting for input, regularly polling for connection", function(){

		});
	});

});