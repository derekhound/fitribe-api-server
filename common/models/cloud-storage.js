var AWS = require('aws-sdk')
  , fs  = require('fs');

module.exports = function(CloudStorage) {

  // When Model is attached to an app, attached event will be emitted.
  CloudStorage.on('attached', function () {
    var app = CloudStorage.app;

    // set key
    AWS.config.update({
      accessKeyId: app.get('aws').accessKeyID,
      secretAccessKey: app.get('aws').secretAccessKey
    });

    // set region
    AWS.config.region = app.get('aws').s3.region;
  });


  /**
   * Uoload a file to s3
   * @param {String} filePath File path
   * @param {Object} options Options for uploading
   * @param {Object} options.bucket Bucket name
   * @param {Object} options.key Key name
   * @param {Object} options.type Content Type
   * @callback {Function} cb Callback function
   */
  CloudStorage.upload = function(filePath, options, cb) {

    // read file
    fs.readFile(filePath, function(err, buffer) {

      // upload to s3
      var s3 = new AWS.S3();
      s3.putObject({
        Bucket:       options.bucket,
        Key:          options.key,
        ContentType:  options.type,
        Body:         buffer
      }, function(err, data) {
        if (err) return cb(err);

        var fileObj = {
          bucket: options.bucket,
          key: options.key,
          url: CloudStorage.app.get('aws').s3.location + '/' + options.bucket + '/' + options.key
        };

        return cb(null, fileObj);
      });
    });

  };

  // Download
  CloudStorage.download = function() {};

};
