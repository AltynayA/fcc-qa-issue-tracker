'use strict';

let mongodb = require('mongodb')
let mongoose = require('mongoose')
// const {needsRetryableWriteLabel} = require('mongodb/src/error');
// let uri = 'mongodb+srv://goldmoon321123:' +process.env.PW + '@xxxxxx.xxxxx.mongodb.net/testing?retryWrites=true&w=majority'
let uri = 'mongodb+srv://goldmoon321123:' + process.env.PW + '@cluster0.ro6c6or.mongodb.net/issue_tracker?retryWrites=true&w=majority';
console.log(uri)
module.exports = function (app) {
    // let uri = 'mongodb+srv://user1:' + process.env.PW + '@freecodecamp.b0myq.mongodb.net/issue_tracker?retryWrites=true&w=majority';
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
        .get(async function (req, res) {
                let project = req.params.project;
                let filterObject = Object.assign(req.query)

                filterObject['project'] = project
                try {
                    let issue = await Issue.find(filterObject)
                    if (!issue) {
                        res.status(404).json('Not found')
                        return
                    }
                    res.json(issue)
                } catch (error) {
                    res.status(404).json('Not found')
                    return
                }
            }
        )

        .post(async function (req, res) {
            // console.log("reached post");
            let project = req.params.project;
            if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
                return res.json('Required fields missing from request')
            }
            let newIssue = new Issue({
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to || '',
                status_text: req.body.status_text || '',
                open: true,
                created_on: new Date().toUTCString(),
                updated_on: new Date().toUTCString(),
                project: project
            });
            const savedIssue = await newIssue.save();
            res.json(savedIssue);
        })


        .put(async function (req, res) {
            let project = req.params.project;
            if (!req.body._id) {
                return res.status(400).json('Required fields missing from request')
            }
            if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
                return res.status(400).json({message: 'Invalid ID format'});
            }
            try {
                const initialIssue = await Issue.findById(req.body._id)
                if (!initialIssue) {
                    return res.status(404).json('issue not found')
                }
                let filter = {_id: req.body._id}
                let update = {
                    issue_title: req.body.issue_title || initialIssue.issue_title,
                    issue_text: req.body.issue_text || initialIssue.issue_text,
                    created_by: req.body.created_by || initialIssue.created_by,
                    assigned_to: req.body.assigned_to || initialIssue.assigned_to,
                    status_text: req.body.status_text || initialIssue.status_text,
                    open: true,
                    updated_on: new Date().toUTCString(),
                    project: project
                }
                let changedIssue = await Issue.findOneAndUpdate(filter, update, {
                    new: true
                });
                if (!changedIssue) {
                    return res.status(404).json('issue not found')
                }
                res.json(changedIssue)
            } catch (error) {
                res.status(404).json('not found')
            }
        })

        .delete(async function (req, res) {
            try {
                let project = req.params.project;
                if (!req.body._id) {
                    res.status(400).json('Missing issue ID')
                    return
                }
                if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
                    return res.status(400).json({message: 'Invalid ID format'});
                }
                let filter = {_id: req.body._id}

                let deletedIssue = await Issue.findOneAndDelete(filter);
                res.status(202).json({result:'successfully deleted'})
            } catch (error) {
                res.status(404).json({error:'could not delete', _id:req.body._id})
            }
        });

}
