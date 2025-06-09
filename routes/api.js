'use strict';

var expect = require('chai').expect
const mongoose = require('mongoose')
let mongodb = require('mongodb')
let uri = 'mongodb+srv://goldmoon321123:' +process.env.PW + '@xxxxxx.xxxxx.mongodb.net/testing?retryWrites=true&w=majority'
module.exports = function (app) {
  module.exports = function (app) {
    let uri = 'mongodb+srv://user1:' + process.env.PW + '@freecodecamp.b0myq.mongodb.net/issue_tracker?retryWrites=true&w=majority';
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    let issueSchema = new mongoose.Schema({
      issue_title: {type: String, required: true},
      issue_text: {type: String, required: true},
      created_by: {type: String, required: true},
      assigned_to: String,
      status_text: String,
      open: {type: Boolean, required: true},
      created_on: {type: Date, required: true},
      updated_on: {type: Date, required: true},
      project: String
    })
    let Issue = mongoose.model('Issue', issueSchema);

    app.route('/api/issues/:project')
        .get(function (req, res) {
          let project = req.params.project;

        })
        .post(function (req, res){
          let project = req.params.project;
          let newIssue = new Issue({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to:req.body.assigned_to || '',
            status_text: req.body.status_text || '',
            open: true,
            created_on: new Date().toUTCString(),
            updated_on: new Date().toUTCString(),
            project: project
          })
          newIssue.save((error, savedIssue) => {
            if(!error && savedIssue) {
              console.log(savedIssue)
              // return
            }
          })

        })


        .put(function (req, res) {
          let project = req.params.project;

        })

        .delete(function (req, res) {
          let project = req.params.project;

        });

  };
}
