const assert = require('assert');
const request = require('request');
const {app, makeIntoObj} = require('../server.js');

describe('Server', () => {

  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:3000/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  it('should return a status of 200', (done) => {
    this.request.get('/', (err, res) => {
      if (err) { done(err); }
      assert.equal(res.statusCode, 200);

      done();
    });
  });
});

describe('POST /post', () => {

  it('should not return a 404 status', (done) => {
    this.request.post('/post', (err, res) => {
      if (err) { done(err); }
      assert.notEqual(res.statusCode, 404);
      done();
    })
  })
})

describe('helper functions', () => {

  it('should have makeIntoObj make an array into an obj', (done) => {
    var text = ['hello', 'these are messages', 'so glad to be here'];
    const test = makeIntoObj(text);
    console.log(test);

    assert.deepEqual(test, { body: { text: 'hello these are messages so glad to be here' } })
    done();
  });
});
