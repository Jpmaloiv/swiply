const express = require('express');
const router = express.Router();
const db = require('../models');


router.post('/add', (req, res) => {
  console.log("QUERY", req.query)

    const content = {
        id: req.query.id,
        name: req.query.name,
        description: req.query.description,
        PageId: req.query.pageId
      }
    
      db.Content.create(content)
        .then(resp => {
          res.status(200);
          res.json({ success: true, message: 'Content created!'});
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Internal server error.", error: err });
        })

})

router.get('/search', (req, res) => {

  let query = { where: {}}

  if (req.query.id) query.where.id = req.query.id


  db.Content.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Content found!', response: resp, EMBEDLY_API_KEY: process.env.EMBEDLY_API_KEY });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})

module.exports = router;
