var chai = require('chai');
var Strategy = require('../lib/strategy');
var jws = require('jws');


describe('Strategy', function() {
  
  it('should be named dpop', function() {
    var strategy = new Strategy(function(token, cb) {
      throw new Error('verify function should not be called');
    });
    
    expect(strategy.name).to.equal('pop');
  });
  
  it('should authenticate request with valid signature in header field', function(done) {
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
  }); // should authenticate request with valid signature in header field
  
  it('should authenticate request with valid signature in form-encoded body parameter', function(done) {
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
        req.body = {};
        req.body.pop_access_token = credential;
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should authenticate request with valid signature in form-encoded body parameter
  
  it('should authenticate request with valid signature in URI query parameter', function(done) {
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
        req.query = {};
        req.query.pop_access_token = credential;
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should authenticate request with valid signature in URI query parameter
  
  it('should challenge request without credential', function(done) {
    var strategy = new Strategy(function(token, cb) {
      throw new Error('verify function should not be called');
    });
    
    chai.passport.use(strategy)
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should challenge request without credential
  
  it('should challenge request with invalid signature', function(done) {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      return cb(null, { id: '248289761001' }, 'keyboard cat');
    });
    
    var credential = jws.sign({
      header: { alg: 'HS256' },
      payload: {
        at: '2YotnFZFEjr1zCsicMWpAA'
      },
      secret: 'keyboard dog',
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP ' + credential;
      })
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP error="invalid_token", error_description="Invalid signature"');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should challenge request with invalid signature
  
  it('should challenge request when verify function yields without user', function(done) {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      return cb(null, false);
    });
    
    var credential = jws.sign({
      header: { alg: 'HS256' },
      payload: {
        at: '2YotnFZFEjr1zCsicMWpAA'
      },
      secret: 'keyboard dog',
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP ' + credential;
      })
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP error="invalid_token"');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should challenge request when verify function yields without user
  
  it('should challenge request when verify function yields without user and includes explanation', function(done) {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      return cb(null, false, { message: 'The access token expired' });
    });
    
    var credential = jws.sign({
      header: { alg: 'HS256' },
      payload: {
        at: '2YotnFZFEjr1zCsicMWpAA'
      },
      secret: 'keyboard dog',
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP ' + credential;
      })
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP error="invalid_token", error_description="The access token expired"');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should challenge request when verify function yields without user and includes explanation
  
  it('should challenge request when verify function yields without user and includes explanation as string', function(done) {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      return cb(null, false, 'The access token expired');
    });
    
    var credential = jws.sign({
      header: { alg: 'HS256' },
      payload: {
        at: '2YotnFZFEjr1zCsicMWpAA'
      },
      secret: 'keyboard dog',
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP ' + credential;
      })
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP error="invalid_token", error_description="The access token expired"');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  }); // should challenge request when verify function yields without user and includes explanation as string
  
  it('should challenge request without credential using realm option passed to constructor', function(done) {
    var strategy = new Strategy({ realm: 'example' }, function(token, cb) {
      throw new Error('verify function should not be called');
    });
    
    chai.passport.use(strategy)
      .fail(function(challenge, status) {
        expect(challenge).to.equal('PoP realm="example"');
        expect(status).to.be.undefined;
        done();
      })
      .authenticate();
  });
  
  it('should refuse request with signature transmitted in both header field and form-encoded body parameter', function(done) {
    var strategy = new Strategy(function(token, cb) {
      throw new Error('verify function should not be called');
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo';
        req.body = {};
        req.body.pop_access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo';
      })
      .fail(function(status) {
        expect(status).to.equal(400);
        done();
      })
      .authenticate();
  });
  
  it('should refuse request with signature transmitted in both header field and URI query parameter', function(done) {
    var strategy = new Strategy(function(token, cb) {
      throw new Error('verify function should not be called');
    });
    
    chai.passport.use(strategy)
      .request(function(req) {
        req.headers['authorization'] = 'PoP eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo';
        req.query = {};
        req.query.pop_access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdCI6IjEyMzQ1NiIsInRzIjoxMjM0NTY3OH0.Pocf1CzRha25nwCfoZynProYLcV1UE5SlcRGa3qzZXo';
      })
      .fail(function(status) {
        expect(status).to.equal(400);
        done();
      })
      .authenticate();
  });
  
});
