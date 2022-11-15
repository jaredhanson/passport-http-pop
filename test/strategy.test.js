var chai = require('chai');
var Strategy = require('../lib/strategy');
var jws = require('jws');


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
      expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      return cb(null, { id: '248289761001' }, 'keyboard cat');
    });
    
    var credential = jws.sign({
      header: { alg: 'HS256' },
      payload: {
        at: '2YotnFZFEjr1zCsicMWpAA'
      },
      secret: 'keyboard cat',
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP ' + credential;
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should authenticate request with valid credentials
  
  
});
