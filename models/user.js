const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
    }
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("user",userSchema);
module.exports = user;