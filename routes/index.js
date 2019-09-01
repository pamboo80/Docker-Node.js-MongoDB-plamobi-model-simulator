var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', 
  { title: 'plaMobi Data Model REST APIs Simulation',
    chatOptions: ["No", "Yes"],
    postTypes: ["General", "Sell", "Seek"]  ,
    postLocations: ["Current Location", "whereever I move"]
  });
});

module.exports = router;
