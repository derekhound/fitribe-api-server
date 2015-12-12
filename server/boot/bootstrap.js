module.exports = function(app) {

  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  // Create admin user
  User.findOne({
    where: {
      email: 'admin@fitribe.com'
    }
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      User.create({
        email: 'admin@fitribe.com',
        password: '1234'
      }, function(err, user) {
        if (err) throw err;

        // Create admin role
        Role.create({
          name: 'admin'
        }, function(err, role) {

          // Make admin user as admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, function(err, principal) {
            if (err) throw err;
          });

        });

      });
    }
  });

};
