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

        console.log("admin@fitribe.com is created");
        console.log("- id: " + user.id);
      });
    } else {
      console.log("admin@fitribe.com already exists");
      console.log("- id: " + user.id);
    }
  });

  // Create admin role
};
