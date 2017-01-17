var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('./Models/user')
mongoose.connect('mongodb://localhost/EMS');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register

app.post('/addUser',function(req,res){
   
    if(req.body.firstName){
      
        if(req.body.lastName){
            
            if(req.body.email){
                
                if(isEmail(req.body.email)){
                    
                    if(user.findOne({email:req.body.email},function(err,users){
                        
                        console.log(user.length)
                        console.log(user.email)
                        console.log(req.body.email)
                        
                         if(user.length){
                            res.json({success:false , message : 'Email id is already registered. Please try with different email'})            
                        }else{
                            if(req.body.password){
                                user.create(req.body,function (err,user){
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
                        }
                    }));
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

//app.post('/addUser', function(req,res){
//    
//  User.find({email: req.body.email},function(err,users){
//  if(err) throw err;
//  if(users.lenght){
//       res.send("User already exist")
//  }else{
//        User.create(req.body,function (err,user){
//        if(err) {
//            res.send("Some error occured during the creation" + err);
//        } else {
//            res.status(200);
//            res.send("New User added " + req.body.firstName  + req.body.lastName + req.body.email + req.body.password);
//        }
//    });
//  }
//  });
//});

//Login

app.post('/login', function(req,res){

  user.find({email : req.body.email , password : req.body.password}, function(err, users){

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

function isEmail(email) { 
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
} 