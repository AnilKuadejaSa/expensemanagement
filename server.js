var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('./Models/user')
mongoose.connect('mongodb://192.168.1.66/EMS');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register

app.post('/addUser',function(req,res) {
    if(req.body.firstName) {
        if(req.body.lastName) {
            if(req.body.email) {
                if(isEmail(req.body.email)) {
                    if(req.body.password) {
                                user.create(req.body,function (err,user) {
                                if(err) {
                                    res.send("Some error occured during the creation" + err);
                                } else {
                                    res.status(200);
                                    res.json({success:true,message : "New user added.",firstName : req.body.firstName,lastName : req.body.lastName})            
//                                    res.send("New User added " + req.body.firstName  + req.body.lastName + req.body.email + req.body.password);
                                }
                                 });
                            }else{
                                res.json({success:false , message : 'password is missing. Please enter password'})      
                            }

                    // if(user.findOne({email:req.body.email},function(err,users){
                        
                    //     console.log(user.length)
                    //     console.log(user.email)
                    //     console.log(req.body.email)
                        
                    //      if(user.length){
                    //         res.json({success:false , message : 'Email id is already registered. Please try with different email'})            
                    //     }else{
                            
                    //     }
                    // }));
                }else{
                    res.json({success:false , message : 'Please enter valid email id'})            
                }
                
            }else{
                res.json({success:false , message : 'email is missing. Please enter email'})        
            }
        }else{
            res.json({success:false , message : 'last name is missing. Please enter last name'})    
        }
    }else{
        res.json({success:false , message : 'first name is missing. Please enter first name'})
    }
    
//    let emailId = req.body.email 
//    
//    if(user.findOne({email:emailId},function(err,users){
//      
//        if(err){
//            res.json({success:false , message : 'Something went wrong'})
//        }else if(user){
//            
//            console.log(typeof(req.body.email))
//            
//            // check here if user is type of string then allow to go further.
//            
//            if(typeof(req.body.email) === String){
//                
//                if(user.length){
//                    res.json({success:false , message : 'user already exists.'})
//                }    
//                
//            }else{
//                res.json({success:false , message : 'please enter proper email id.'})
//            }
//            
//        }else{
//            
//         if(String(req.body.firstName)){
//             
//             if(req.body.length > 0 && req.body.lastName < 30){
//                users.firstName = req.body.firstName 
//             }else{
//                  res.json({success:false , message : 'first name length is not proper.'})
//             }
//             
//         }else{
//             res.json({success:false , message : 'first name is identical to String only'})
//         }
//            
//        } 
    });
//});


app.post('/login',function(req,res){
    let input = req.body;
    // check if email is blank
    if (input.email == "") {
        res.status(400).json({message : 'Please enter email'})
    } else if (input.password == "") { // check is password is blank
        res.status(400).json({message : 'Please enter password'})
    } else {
        // check if user is there in the database
        user.findOne({'email':input.email,'password':input.password},function (err,user){
            // check if there is no error and user object 
            if (!err && user!=null) {
                // // send full user object
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

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});

function isEmail(email) { 
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
} 