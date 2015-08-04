var fs = require('fs'),
    Transform = require('stream').Transform,
    Writable = require('stream').Writable,
    kinesis = require('kinesis'),
    KinesisStream = kinesis.KinesisStream,
    AWS = require('aws-sdk');

// Uses credentials from process.env by default
// Questions 
//
// How to separate data from multiple streams (one cache is not adequate)
// If we should use one file inside a bucket, when we should change files (2 weeks?)
// What mechanism we are using to change files
// If we are implementing real time alerts, how we should cache the alerts ( one building? what thorughput time cost)
// How to upload a whole file vs a buffer
// How to pull last new record


// TODO
// 
// convert to promises

var cache = [];

var config = {
  name: 'teststream',
  region: 'us-east-1',
  Bucket: 'residentialbuildings-1',
  Key: 'log1'
}

// var kinesisSource = kinesis.stream({name: config.name , oldest: true});
// would want something in the vein of the aws preferred method (if one fails, get last data push);
// AFTER_SEQUENCE_NUMBER

var kinesisSource = kinesis.stream({name: config.name });
var output = new Writable ({objectMode: true});

var s3 = new AWS.S3({params: config});

output._write = function (chunk, encoding, callback){
  data = alert(chunk);
  process(data);
  callback();
}

// // Data is retrieved as Record objects, so let's transform into Buffers
var bufferify = new Transform({objectMode: true})
bufferify._transform = function(record, encoding, cb) {
  cb(null, record.Data)
}


kinesisSource.pipe(bufferify).pipe(output);
//kinesisSource.pipe(bufferify).pipe(fs.createWriteStream('click.log'));

function process (object) {
  cache.push(object);
  if (cache.length >= 100){
    console.log('/-/-/-/-/-/-/push now to AWS/-/-/-/-/-/-/-/');
    var resonse = s3_Upload(JSON.stringify(cache));
    cache = [];
  }
}

function alert (object) {
  var data = JSON.parse(object.toString('utf-8'))
  console.log('utf-8', data.time);
  return data;
}

function s3_Upload (dataArray){
  s3.createBucket(function(err){
    if(err){
      console.log("Error:", err);
      return false;
    }
    else{
      s3.upload({Body: dataArray }, function(err){
        if(err){
          console.log("Error:", err);
          return false;
        }
        else { console.log("successfully uploaded data"); }
      });
    }
  })

}
