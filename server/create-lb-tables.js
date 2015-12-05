var server = require('./server');
var ds = server.dataSources.mysql;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(err) {
  if (err) throw err;
  console.log('Looback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
