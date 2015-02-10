var bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var db = require('../config/mongo_database');

mongoose.connect(db.mongodbURL, db.mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + db.mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + db.mongodbURL);
    }
});

var Schema = mongoose.Schema;
 
// User schema
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;
 
  if (!user.isModified('password')) return next();
 
  bcrypt.genSalt(db.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
 
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});
 
//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

//Define Models
var userModel = mongoose.model('User', User);

// Export Models
exports.userModel = userModel;
