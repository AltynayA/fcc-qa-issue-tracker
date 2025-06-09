'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = '',
        status_text = '',
      } = req.body;
    })
    if (!issue_title || !issue_text || !created_by) {
      return res.status(400).json({ error: 'required field(s) missing' });
    }
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
