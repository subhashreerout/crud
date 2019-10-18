var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const { check, validationResult } = require('express-validator');

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cruddb',
    // multipleStatements: true
});
  
// connect to database
dbConn.connect(); 
 
 
// Retrieve all users 
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
 
 
// Retrieve user with id 
app.get('/user/:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
  
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
  
});


// Search for todos with ‘bug’ in their name
app.get('/users/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    dbConn.query("SELECT * FROM users WHERE user LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Users search list.' });
    });
});



app.get('/users/search/:keyword', function (req, res) {
    let keyword = req.body.keyword;
    dbConn.query("SELECT * FROM users WHERE user LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Users search list.' });
    });
});

// Insert new user 
app.post('/users', function (req, res) {
    var postData = req.body;
    if (!postData) {
              return res.status(400).send({ status:false, message: 'Please provide user' });
            }
    dbConn.query("INSERT INTO users SET ?", postData, function (error, results, fields) {
        if (error) throw error;
        return res.send({ code: 200, status: true, message: 'New user has been created successfully.', insertId: results.insertId });
        console.log(results.insertId); // Auto increment id
        // res.end(JSON.stringify(results));
      });
    });



//  Update user with id
app.put('/user/:id', function (req, res) {

    var user = req.body;
    var user_id = req.body.user_id;
  
    if (!user_id || !user) {
        return res.status(400).send({code: 400, status: false, message: 'Please provide user and user_id' });
    }
  
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ code: 200, status: true, message: 'user has been updated successfully.' });
    });
});



// Delete user with id 
app.delete('/user/:id',(req,res)=>{
    dbConn.query('DELETE FROM users WHERE id=?',[req.params.id],(err,rows,fields)=>{
        if(!err)
        res.send({code: 400, status: true, message: 'Deleted Successfully'});
        else
        return res.send({code: 200, status: false, message: 'Provide user id'})
        console.log(err);
    });
});



// follow user
app.post("/follow/:id", function(req, res){
    var follow = {id:follower_id, user_id:followed_id};
    
    connection.query('INSERT INTO follow_unfollow SET ?', follow , function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});

// unfollow user
app.delete("/unfollow:id", function(req, res){
  var unfollow = {id:follower_id, user_id:followed_id};

  connection.query('DELETE INTO follow_unfollow SET ?', unfollow , function(err, result) {
      if (err) throw err;
      res.redirect("/");
    });
});

 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;