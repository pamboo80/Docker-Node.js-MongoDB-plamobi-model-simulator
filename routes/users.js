var express = require('express');
var request = require("request")
var router = express.Router();

/*
 * GET landmarklist.
 */
router.get('/landmarklist/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var id = req.params.id;
    //console.log(id);    
    collection.find({ '_id' : id }, {}, function (e, docs) {
        
        //res.json(docs);
        var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location= '
                  + docs[0].latitude + ',' + docs[0].longitude+ '&radius=1000&key=AIzaSyA-BXeSjAy8z867DPBQlNRaPgFM6tAzEzY';
        //var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=AIzaSyA-BXeSjAy8z867DPBQlNRaPgFM6tAzEzY';
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            
            if (!error && response.statusCode === 200) {
                //console.log(body) // Print the json response                         
                var results = [];
                for (var i = 0; i < body.results.length; i++) {
                    
                    var name = body.results[i].name;
                    var username = name.split(" ");
                    results.push({                       
                            "username": (username.length>1)? username[0]+" "+ username[1]:name,   
                            "userImg": body.results[i].icon,                    
                            "latitude": body.results[i].geometry.location.lat, 
                            "longitude": body.results[i].geometry.location.lng,
                            "email": (i % 3 == 0)? "": (i % 2 == 0)? "kumar"+i*21+"@gmail.com" : "raja" + i * 21 + "@gmail.com", 
                            "phone": (i % 3 == 0)? "+919"+i*2+"21"+ i * 2+"41"+ i * 17: "",
                            "chat": (i % 3 == 0)? "": (i % 2 == 0)? "1" : "0",         
                            'message': body.results[i].name,
                            'messageType': (i % 3 == 0)? "General": (i % 2 == 0)? "Sell" : "Seek",    
                            "messageTimeStamp": new Date().getTime()                        
                    });
                
                }
                
                res.json(results);
            }

        });
    });

});

/*
 * GET landmarklist by lat and lng.
 */
router.get('/landmarklist/:lat/:lng', function (req, res) {

    var lat = req.params.lat,
        lng = req.params.lng;
        
    //res.json(docs);
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location= ' 
                + lat + ',' + lng + '&radius=1000&key=AIzaSyA-BXeSjAy8z867DPBQlNRaPgFM6tAzEzY';
    //var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=AIzaSyA-BXeSjAy8z867DPBQlNRaPgFM6tAzEzY';
    request({
        url: url,
        json: true
    }, function (error, response, body) {
            
        if (!error && response.statusCode === 200) {
            //console.log(body) // Print the json response
            var results = [];
            for (var i = 0; i < body.results.length; i++) {
               
                var name = body.results[i].name;
                var username = name.split(" ");
                results.push({
                    "username": (username.length > 1)? username[0] + " " + username[1]:name,   
                    "userImg": body.results[i].icon,                    
                    "latitude": body.results[i].geometry.location.lat, 
                    "longitude": body.results[i].geometry.location.lng,
                    "email": (i % 3 == 0)? "": (i % 2 == 0)? "kumar" + i * 21 + "@gmail.com" : "raja" + i * 21 + "@gmail.com", 
                    "phone": (i % 3 == 0)? "+919" + i * 2 + "21" + i * 2 + "41" + i * 17: "",
                    "chat": (i % 3 == 0)? "": (i % 2 == 0)? "1" : "0",         
                    'message': body.results[i].name,
                    'messageType': (i % 3 == 0)? "General": (i % 2 == 0)? "Sell" : "Seek",    
                    "messageTimeStamp": new Date().getTime()
                });
                
            }
          
            res.json(results);
        }

    });

});


/*
 * GET userlist.
 */
router.get('/userlist', function (req, res) {       
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
/*
 * GET messagelist.
 */
router.get('/messagelist', function (req, res) {
    var db = req.db;
    var collection = db.get('messagelist');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);       
    });
});

/*
 * GET messagelist by id.
 */
router.get('/messagelist/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('messagelist');
    var id = req.params.id;
    //console.log(id);    
    collection.find({ 'userID' : "'"+id+"'" }, {}, function (e, docs) {      
        res.json(docs);        
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection1 = db.get('userlist');
    var data = req.body;
    //console.log(data);
    var postMessage = data.postMessage;
    delete data["postMessage"];
    var insertedDocID = '';
    //console.log(postMessage);
    //console.log(data);
    collection1.insert(data, function (err, result){
        
        if (err === null) {
            insertedDocID = result._id;

            postMessage = JSON.parse(postMessage);

            postMessage.userID = "'"+insertedDocID+"'";
            postMessage.timeStamp = "'"+new Date().getTime() + "'";
            
            var collection2 = db.get('messagelist');                        
                      
            collection2.insert(postMessage, function (err, result) {               
                res.send(
                    (err === null) ? { msg: '{result:'+ result._id + '}' } : { msg: '{result:-1}' }
                );
            });
        
            /*res.send(
                { msg: '' }
            */
        }
        else {
            //console.log(err);
            res.send(
              { msg: '{result:-1}' }
            );
        }      

      
    });
    
  
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    //collection update
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });

});

/*
 * DELETE to deletepost.
 */
router.delete('/deletepost/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var postToDelete = req.params.id;
    //collection update
    collection.update({ '_id' : postToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
    
});


module.exports = router;