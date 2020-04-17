let express = require('express');
let router = express.Router();
let mongoose = require('../tools/mongoose')
let jwt = require('jsonwebtoken');
let secretOrPrivateKey = "secret expressJWT"
let bcrypt = require('bcryptjs');
const sanitizeBody = require('../../middleware/sanitizeBody')
let ErrorMsg = require('../obj/ErrorMsg')
let salt = bcrypt.genSaltSync(10);
let User = require('../tools/schema')


router.patch('/users/me', function (req, res, next) {
    if(!req.body.password){
        let errMsg = new ErrorMsg("Bad Request", "400", "Param Error", "password is not define in body", "/auth/users/me")
        res.status(400).send(errMsg);
        return;
    }
    User.find({"email": req.user.email}).then((result=>{
        if(result.length > 0){
            let newUser = result[0];
            // newUser.password = bcrypt.hashSync(req.body.password,salt);
            User.findByIdAndUpdate(req.user.id, {password: bcrypt.hashSync(req.body.password,salt)}).then((result=>{
                res.send({data:null})
            }))
        }else{
            let errMsg = new ErrorMsg("Bad Request", "401", "User Auth Error", "this user can not modify", "/auth/users/me")
            res.status(401).send(errMsg);
        }
    }))
});

router.get('/users/me', function (req, res, next) {
    // console.log(req.user)
    User.find({"email": req.user.email}).then((result=>{
        if(result.length > 0){
            res.json({
                data: {
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    email: result[0].email,
                }
            })
        }else{
            var errMsg = new ErrorMsg("Bad Request", "404", "User Error", "user not exists", "/auth/users/me")
            res.status(404).send(errMsg);
        }
    }))
});

router.post('/tokens', function (req, res, next) {
    let email = req.body.email;
    User.find({"email": email}).then((result=>{
        console.log(result)
        // console.log(bcrypt.hashSync(req.body.password,salt))
        if(result.length > 0 && bcrypt.compareSync(req.body.password, result[0].password)){
            res.json({
                data: {
                    token: jwt.sign({email:
                         email, id: result[0]._id}, secretOrPrivateKey, {
                        expiresIn: 3600 * 1 * 24
                    })
                }
            })
        }else{
            let errMsg = new ErrorMsg("Bad Request", "401", "Validation Error", "email or password validate", "/auth/tokens")
            res.status(401).send(errMsg);
        }
    }))
    
});

router.post('/users', function (req, res, next) {
    let body = req.body;
    if (!(body.email && body.password && body.firstName && body.lastName)) {
        let errMsg = new ErrorMsg("Bad Request", "400", "Validation Error", "user info null value.", "/auth/users")
        res.status(400).send(errMsg);
        return;
    }
    let email = body.email;
    if(!IsEmail(email)){
        let errMsg = new ErrorMsg("Bad Request", "400", "Validation Error", email+" is not a valid email address.", "/auth/users")
        res.status(400).send(errMsg);
        return;
    }
    let saveUser = body;
    saveUser.password = bcrypt.hashSync(body.password,salt);
    let user = new User(body)
    User.find({"email": email}).then((result=>{
        console.log(result)
        if(result.length > 0){
            let errMsg = new ErrorMsg("Bad Request", "400", "Validation Error", email+" is already exist", "/auth/users")
            res.status(400).send(errMsg);
        }else{
            user.save(function (err, res) {
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Res:" + res);
                }
            });
            res.send(200)
        }
    }))
});

function IsEmail(str) {
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    return reg.test(str);
}


module.exports = router;