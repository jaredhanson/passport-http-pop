var chai = require('chai');
var Strategy = require('../lib/strategy');


describe('Strategy', function() {
  
  var strategy = new Strategy(function(token, cb) {
    throw new Error('verify function should not be called');
  });
  
  it('should be named dpop', function() {
    expect(strategy.name).to.equal('pop');
  });
  
  // https://developers.commerce.campaignmonitor.com/#oauth
  
  it('should authenticate request with valid credentials', function(done) {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('123456');
      return cb(null, { id: '248289761001' }, 'partner-app-client-secret');
    });
    
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.connection = {};
        req.connection.encrypted = true;
        req.url = '/protectedresource';
        req.headers['host'] = 'resource.example.org';
        //req.headers['authorization'] = 'PoP eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.J6DUAy9TopLOfIJHFbY2BNDankWID9ZvJ-ylHoV_a6k';
        req.headers['authorization'] = 'PoP eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo';
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .authenticate();
  });
  
  
});
