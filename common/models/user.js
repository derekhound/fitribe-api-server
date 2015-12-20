var path   = require('path')
  , moment = require('moment')
  , fs     = require('fs')
  , AWS    = require('aws-sdk')
  , im     = require('imagemagick');

module.exports = function(User) {

  User.uploadAvatar = function(req, res, cb) {

    var userId = req.accessToken.userId;

    // upload file to local storage
    var options = {
      container: 'avatar',
      allowedContentTypes: ['image/jpeg', 'image/png'],
      getFilename: function(file, req, res) {
        var ext  = path.extname(file.name);
        var name = moment().valueOf();
        return name + ext;
      }
    };
    User.app.models.LocalStorage.upload(req, res, options, function(err, data) {
      if (err) return cb(err);

      var file = data.files.file[0]
      var srcPath = './server/storage/avatar/' + file.name;
      var dstPath = './server/storage/avatar/' + file.name + '.sm';

      // resize avatar
      im.resize({
        srcPath: srcPath,
        dstPath: dstPath,
        width: 80
      }, function(err, stdout, stderr) {
        if (err) return cb(err);

        // Upload file to cloud storage
        var params = {
          bucket: User.app.get('aws').s3.bucket,
          key: 'user/' + userId + '/album/avatar/avatar.jpg',
          type: file.type
        };
        User.app.models.CloudStorage.upload(dstPath, params, function(err, data) {
          if (err) return cb(err);

          // Delete files
          fs.unlinkSync(srcPath);
          fs.unlinkSync(dstPath);

          return cb(null, data);
        });
      });
   });
  };

  User.remoteMethod(
    'uploadAvatar',
    {
      description: 'Uploads one avatar for the specified user. The request body must use multipart/form-data which the file input type for HTML uses.',
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      returns: {
        arg: 'fileObject', type: 'object', root: true
      },
      http: { path: '/:id/avatars', verb: 'post' }
    }
  );

};
