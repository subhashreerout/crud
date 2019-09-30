var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
  
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdb',
    multipleStatements: true
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


// Add a new user  
app.post('/user', function (req, res) {
  
    let user = req.body.user;
  
    if (!user) {
        return res.status(400).send({ error:true, message: 'Please provide user' });
    }
  
    dbConn.query("INSERT INTO users SET ? ", { user: user }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});


// Insert user with id 
// app.post('/user',(req,res)=>{
//     let emp = req.body;
//     var sql = "SET @id = ?;SET @first_name = ?;SET @last_name = ?;SET @user_name = ?;SET @email = ?;SET @password = ?;SET @DOB = ?;SET @follow_unfollow = ?; \
//     CALL UserAddOrEdit(@id,@first_name,@last_name,@user_name,@email,@password,@DOB,@follow_unfollow);";
//     dbConn.query(sql,[emp.id,emp.first_name,emp.last_name,emp.user_name,emp.email,emp.password,emp.DOB,emp.follow_unfollow],(err,rows,fields)=>{
//         if(!err)
//         res.send('Inserted Successfully');
//         else
//         console.log(err);
//     });
// });


//  Update user with id
app.put('/user/:id', function (req, res) {
  
    let user_id = req.body.user_id;
    let user = req.body.user;
  
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
  
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});
 
// Update user with id
// app.put('/user/:id',(req,res)=>{
//     let emp = req.body;
//     var sql = "SET @id = ?;SET @first_name = ?;SET @last_name = ?;SET @user_name = ?;SET @email = ?;SET @password = ?;SET @DOB = ?;SET @follow_unfollow = ?; \
//     CALL UserAddOrEdit(@id,@first_name,@last_name,@user_name,@email,@password,@DOB,@follow_unfollow);";
//     dbConn.query(sql,[emp.id,emp.first_name,emp.last_name,emp.user_name,emp.email,emp.password,emp.DOB,emp.follow_unfollow],(err,rows,fields)=>{
//         if(!err)
//         res.send('Updated Successfully');
//         else
//         console.log(err);
//     });
// });


//  Delete user
app.delete('/user/:id', function (req, res) {
  
    let user_id = req.body.user_id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});

// Delete user with id 
// app.delete('/user/:id',(req,res)=>{
//     dbConn.query('DELETE FROM users WHERE id=?',[req.params.id],(err,rows,fields)=>{
//         if(!err)
//         res.send('Deleted Successfully');
//         else
//         console.log(err);
//     });
// });


// follow user
app.post("/follow/:id", function(req, res){
    var follow = {follower_id:currentUser.id, followee_id:user_id};

    connection.query('INSERT INTO users SET ?', follow , function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});


// unfollow user
app.delete("/unfollow", function(req, res){
    var unfollow = {follower_id:currentUser.id, followee_id:user_id};

    connection.query('DELETE INTO users SET ?', unfollow , function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});
 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;