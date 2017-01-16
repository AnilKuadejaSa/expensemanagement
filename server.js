var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./Models/user')
mongoose.connect('mongodb://localhost/EMS');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register

app.post('/adduser', function(req,res){
    
  console.log(req);    
    
  User.find({email: req.body.email},function(err,users){
  if(err) throw err;
  if(users.lenght){
       res.send("User already exist")
  }else{
        User.create(req.body,function (err,user){
        if(err) {
            res.send("Some error occured during the creation" + err);
        } else {
            res.status(200);
            res.send("New User added " + req.body.firstName  + req.body.lastName + req.body.email + req.body.password);
        }
    });
  }
  });
});

//Login

app.post('/login', function(req,res){

  User.find({email : req.body.email , password : req.body.password}, function(err, users){

    if(err) throw err;

    if(users.length == 1){
        res.send("User logged in")
    }
else{
     res.send("Invalid data")
}
});
});


app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});