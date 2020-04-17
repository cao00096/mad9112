let express = require('express');
let router = express.Router();
let mongoose = require('../tools/mongoose')
let User = require('../tools/schema')
let ErrorMsg = require('../obj/ErrorMsg')
const Schema = mongoose.Schema;

ObjectId = Schema.Types.ObjectId
let PeopleSchema = new Schema({
    name: { type: String, required: true, maxlength: 254 },
    birthDate: { type: Date, required: true },
    owner: {type: ObjectId, ref: 'User', required: true},
    sharedWith: [{ type: ObjectId, ref: 'User'}],
    gifts: [{ type: ObjectId, ref:'Gift'}],
    imageUrl: { type: String, maxlength: 1024 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
let People = mongoose.model('People', PeopleSchema)


let GiftSchema = new Schema({
    name: { type: String, required: true, max: 64, min: 4 }, 
    price: { type: Number, min: 100, default:1000 },
    imageUrl: {type: String, min: 1024},
    store: {name:{type:String, max:254}, productURL:{type:String, max: 1024}}
});
let Gift = mongoose.model('Gift', GiftSchema)

router.post('/', function(req, res, next) {
    console.log(req.user)
    if(!req.user){
        var errMsg = new ErrorMsg("Not Auth", "401", "User Error", "token error", "/api/people")
        res.status(401).send(errMsg);
        return;
    }
    User.find({"email": req.user.email}).then((result=>{
        if(result.length > 0){
            var body = {...req.body, owner: req.user.id};
            var people = new People(body);
            people.save(function (err, res) {
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Res:" + res);
                }
            });
            res.send(200)
        }else{
            var errMsg = new ErrorMsg("Not Auth", "401", "User Error", "token error", "/api/people")
            res.status(401).send(errMsg);
        }
    }))
});

router.get('/', function(req, res, next) {
    People.find().then((result=>{
        res.send({data:result})
    }))
});

router.delete(`/:id`, function(req, res, next) {
    People.findByIdAndRemove(req.params.id, function(err, r){
        if(err){
            console.log(err)
        }
        res.send({data: "success"})
    })
});

router.patch(`/:id`, function(req, res, next) {
    People.findByIdAndUpdate(req.params.id, req.body).then(result=>{
        res.send({data: "success"})
    })
});

router.put(`/:id`, function(req, res, next) {
    People.replaceOne({"_id":req.params.id}, req.body).then(result=>{
        res.send({data: "success"})
    })
});

router.get(`/:id`, function(req, res, next) {
    console.log(req.params.id)
    People.findById(req.params.id).populate('sharedWith').populate('gifts').exec(function (err, result){
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
        res.json({data: result})
    }) 
});

// router.get(`/:id`, function(req, res, next) {
//     console.log(req.params.id)
//     let people = People.findById(req.params.id).populate('sharedWith').populate('select gifts')
//     res.json({data: people})
// });

router.delete(`/:id/gift/:giftId`, function(req, res, next) {
    console.log(req.params.giftId);
    Gift.findByIdAndRemove(req.params.giftId, function(err, r){
        if(!err){
            People.findByIdAndUpdate(req.params.id, {$pull:{gifts: req.params.giftId}}).then((result=>{
                console.log(result)
                res.json({data:"success"})
            }))
        }
    })
});

router.patch(`/:id/gift/:giftId`, function(req, res, next) {
    Gift.findByIdAndUpdate(req.params.giftId, req.body).then((result=>{
        console.log(result)
        res.json({data:"success"})
    }))
    
});

router.post(`/:id/gift`, function(req, res, next) {
    let gift = new Gift(req.body)
    gift.save(function (err, r) {
        if (err) {
            var errMsg = new ErrorMsg("Database error", "500", "Error", err, "/api/people/:id/gift")
            res.status(500).send(errMsg);
            return;
        } else {
            // console.log("Res:" + r);
            giftId = r._id
    
            People.findByIdAndUpdate(req.params.id, {$addToSet:{gifts: giftId}}).then((result=>{
                console.log(result)
                res.json({data:"success"})
            }))
        }
    });
});

module.exports = router;
