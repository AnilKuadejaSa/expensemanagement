var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
var userController = require('../../controllers/usercontroller');
var expenseController = require('../../controllers/expensecontroller');
var auth = require('../../middleware/auth');

router.use(function(req,res,next){
    var byPassUrl = ["/user/addUser","/user/login","/user/forgotPassword"]
    if(byPassUrl.indexOf(req.url,byPassUrl) > -1){
        next()
    }else{
        auth.checkAuth(req,res,next)
    }
});

// User
router.route('/user/addUser').post(userController.addUser);
router.route('/user/login').post(userController.login);
router.route('/user/forgotPassword').post(userController.forgotPassword);
router.route('/user/updatePassword').post(userController.updatePassword);
router.route('/user/getAllMembers').get(userController.users);

// Expense
router.route('/expense/addExpense').post(expenseController.addExpense);

module.exports = router;