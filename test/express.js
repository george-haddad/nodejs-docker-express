var superagent = require('superagent');
var expect = require('expect.js');

describe('Express REST API server', function() {
  var id;
  it('Should post an object', function(done) {
    superagent.post('http://192.168.99.100:8080/collection/bitch_collection')
              .send({"name":"whore", "email":"I love Lahme"})
              .end(function(e, res) {
                expect(e).to.eql(null);
                expect(res.body.ops[0]._id.length).to.eql(24);
                id = res.body.ops[0]._id;
                done();
              });
  });

  it('Should return all contents in the DB', function(done) {
    superagent.get('http://192.168.99.100:8080/collection/bitch_collection')
              .end(function(e, res) {
                expect(e).to.eql(null);
                expect(res.body.length).to.be.above(10);
                done();
              });
  });
});
