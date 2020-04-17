let mongoose = require('./mongoose')

const Schema = mongoose.Schema;
let UserSchema = new Schema({
    firstName: { type: String, required: true, maxlength: 64 },
    lastName: { type: String, required: true, maxlength: 64 },
    email: { type: String, required: true, unique: true, maxlength: 512},
    password: { type: String, required: true, maxlength: 70 }
});

let User = mongoose.model('User', UserSchema)

module.exports = User;
