const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
          .post('/api/issues/test')
          .send({
              issue_title: 'Test title',
              issue_text: 'Test text',
              created_by: 'John Wick',
              assigned_to: 'Steve Rogers',
              status_text: 'Pending'
          })
          .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.issue_title, 'Test title');
              assert.strictEqual(res.body.issue_text, 'Test text');
              assert.strictEqual(res.body.created_by, 'John Wick');
              assert.strictEqual(res.body.assigned_to, 'Steve Rogers');
              assert.strictEqual(res.body.status_text, 'Pending');
              done();
          });
    });
});
