var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('./models/user')
var jwt    = require('jsonwebtoken');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

//Environment configration
var config = require('./config/env/development');

if (process.env.NODE_ENV === 'development') {
    config = require('./config/env/development');
} else if (process.env.NODE_ENV === 'production') {
    config = require('./config/env/production');
}

var port = config.PORT || 9090;
// process.env.port

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

app.post('/addUser',function(req,res) {
let input = req.body;

 if (input.email == "") {
        res.status(400).json({message : 'Please enter email'})
} else if (input.password == "") { // check is password is blank
       res.status(400).json({message : 'Please enter password'})
} else if (input.firstName == "") { // check is firstName is blank
       res.status(400).json({message : 'Please enter firstName'})
} else if (input.lastName == "") { // check is lastName is blank
       res.status(400).json({message : 'Please enter lastName'})
} else {
           user.findOne({'email':input.email},function (err,userObj) {
            // check if there is no error and user object 
            if (!err && userObj!=null) {
                res.status(400).json({message: 'User already exists'})
            } else {
                // save the user
                // console.log(config.secret)

                var passwordEncrypt = encrypt(input.password)
               
                let userData = new user({
                     firstName : input.firstName,
                     lastName : input.lastName,
                     email : input.email,
                     password : passwordEncrypt,
                     lent:input.lent,
                     owes:input.owes,
                     secretToken : jwt.sign(input,config.secret)
                });

                userData.save(function (err,user) {

                // user.save(userData),function (err,user){
                //    user.create(user,function (error,user) {
                    if(err) {
                        res.status(400);
                        res.send("Error in SignUp" + err);
                        throw err;
                    } else {
                        res.status(200);
                        res.json({message:'new user added',user:userData});
                        // res.json({success:true,message : "New user added.",firstName : input.firstName,lastName : input.lastName})            
                    //                                    res.send("New User added " + req.body.firstName  + req.body.lastName + req.body.email + req.body.password);
                    }
                });
            }
        })
    }
});


app.post('/login',function(req,res) {
    let input = req.body;
    // check if email is blank
    if (input.email == "") {
        res.status(400).json({message : 'Please enter email'})
    } else if (input.password == "") { // check is password is blank
        res.status(400).json({message : 'Please enter password'})
    } else {
        // check if user is there in the database
        user.findOne({'email':input.email,'password':input.password},function (err,user) {
            // check if there is no error and user object 
            if (!err && user!=null) {
                // send full user object
                //  let secretToken = jwt.sign(user.email,config.secret)
                 res.json({user:user,message : 'User loggedIn successfully'})
                // send particular user data ( if you want to send only specific data )
                //res.json({firstName:user.firstName,lastName:user.lastName,message : 'User loggedIn successfully'})
            } else {
                if (err) {
                    res.status(400).json({message: err.message})
                } else {
                    res.status(404).json({message: 'User not found'})
                }
            }
        })
    }
});

// route to return all users (GET http://localhost:8080/api/users)
app.get('/users', function(req, res) {
  user.find({}, function(err, users) {
    res.json(users);
  });
});   

app.post('/updatePassword', function(req, res) {

    console.log(req)

    let oldPassword = req.body.password
    let emailId = req.body.email
    
    console.log(oldPassword)
    console.log(emailId)

//   user.find({email:emailId}, function(err, users) {

//       if(users.length){

//           console.log(users)

//         if(users.password === oldPassword){
//             res.status(200).json({message: 'Password matches'})
//             console.log(req.body.newPassword)
//         }

//       }else{

//           res.status(400).json({message: 'user not found'})
//       }
//   });
});   

app.post('/Logout',function(req,res) {
    
  user.find({}, function(err, users) {
    res.json(users);
  });
});   

app.post('/resetPassword', function (req, res) {
    if (!req.session.reset) return res.end('reset token not set');
    
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (password !== confirm) return res.end('passwords do not match');
    
    // update the user db here 
    
    forgot.expire(req.session.reset.id);
    delete req.session.reset;
    res.end('password reset');
});


app.post('/forgot-password',function(req,res) {
    let nodemailer = require('nodemailer');
    let smtpTransport = require('nodemailer-smtp-transport');

    // from : sender email address
    // pwd : sender email password
    // to : Receiver email address
    let from = 'tejas.dattani.sa@gmail.com';
    let pwd = 'tejas.sa';
    let to = req.body.email;
    
    // check if email address is exists or not
    user.findOne({email:req.body.email},{'password':1}, function(err,user){
        
        // if user or email address is not exists
        if (err && !user) {
            res.status(404).json({message: 'User not found'})
        } else {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport(
                smtpTransport('smtp://'+from+':'+pwd + '@smtp.gmail.com')
            );
            
            // setup e-mail data with unicode symbols
            let mailOptions = {
                from:   'Tejas Dattani<'+from+'>', // sender address
                to: to, // list of receivers
                subject: 'Forgot Password', // Subject line    
                html:  'Your password is : ' + user.password
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            res.status(200).json({message: 'Mail sent successfully'})
        }  
    });
});

app.get('\get-all-members',function(req,res){

    user.find(function(err,req){

        if(err){
            res.status(400).json({message : err})
        }else{
            res.status(200).json({user})
        }
    });

});


app.listen(port, function () {
  console.log('Example app listening on port!'+port);
});

function isEmail(email) { 
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
} 