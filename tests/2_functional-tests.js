const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let issueId = ''
    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Test title',
                issue_text: 'Test text',
                created_by: 'John Wick',
                assigned_to: 'Steve Rogers',
                status_text: 'Pending'
            })
            .end(function (err, res) {
                issueId = res.body._id
                // if (err) return done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Test title');
                assert.equal(res.body.issue_text, 'Test text');
                assert.equal(res.body.created_by, 'John Wick');
                assert.equal(res.body.assigned_to, 'Steve Rogers');
                assert.equal(res.body.status_text, 'Pending');
                done();
            });
    });
    // #2
    test('When POST with only required fields', function (done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Test title', issue_text: 'Test text', created_by: 'John Rogers',
            })
            .end(function (err, res) {
                assert.equal(res.body.assigned_to, '')
                assert.equal(res.body.status_text, '')

                done()
            })
    });
    // #3
    test('When POST without required fields, return error', function (done) {
        chai.request(server).post('/api/issues/test').send({}).end(function (err, res) {

            assert.equal(res.body.error ,'required field(s) missing')
            done()
        })
    })
    // #4
    test('GET ', function (done) {
        chai.request(server)
            .get('/api/issues/test')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.exists(res.body)
                assert.exists(res.body.length)
                assert.notEqual(res.body.length, 0)
                done();
            })
    })
//     #5
    test('View issues on a project with one filter: ', function (done) {
        chai.request(server)
            .get('/api/issues/test')
            .send({query: {issue_title: 'Test title'}})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.exists(res.body)
                assert.exists(res.body.length)
                assert.notEqual(res.body.length, 0)
                done();
            })
    })
//     #6
    test('View issues on a project with multiple filters', function (done) {
        chai.request(server)
            .get('/api/issues/test')
            .send({query: {issue_title: 'Test title', created_by: 'John Wick'}})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.exists(res.body)
                assert.exists(res.body.length)
                assert.notEqual(res.body.length, 0)
                done();
            })
    })
//     #7
    test('Update one field on an issue', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({created_by: 'Natasha Romanoff', _id: issueId})
            .end(function (err, res) {
                assert.equal(res.body._id, issueId)
                assert.equal(res.body.result, 'successfully updated')
                done()
            })
    })
//     #8
    test('Update multiple fields on an issue', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({created_by: 'Tony Stark', status_text: 'Iloveyou3000', _id: issueId})
            .end(function (err, res) {
                assert.equal(res.body._id, issueId)
                assert.equal(res.body.result, 'successfully updated')
                done()
            })
    })
//     #9
    test('Update an issue with missing _id', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({created_by: 'Tony Stark', status_text: 'Iloveyou3000'})
            .end(function (err, res) {
                assert.equal(res.body.error, 'missing _id')
                done()
            })
    })
//     #10
    test('Update an issue with no fields to update', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({_id: issueId})
            .end(function (err, res) {
                assert.equal(res.status, 400)
                assert.equal(res.body.error,  'no update field(s) sent')
                done()
            })
    })
//     #11
    test('Update an issue with an invalid _id', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({_id: 'ljbkuh12'})
            .end(function (err, res) {
                assert.equal(res.status, 400)
                done()
            })
    })
//     #12
    test('Delete an issue: DELETE request', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({_id: issueId})
            .end(function (err, res) {
                assert.equal(res.status, 202)
                done()
            })

    })
    //     #13
    test('Delete an issue with invalid ID', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({_id: '123trehg5e'})
            .end(function (err, res) {
                assert.equal(res.status, 400)
                done()
            })
    })
//     #14
    test('Delete an issue with missing ID', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 400)
                done()
            })
    })
});
