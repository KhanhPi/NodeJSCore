const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { token } = require('morgan');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        lowercase: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        index: true
    },
    image: String,
    address: String,
    status: {
        type: String,
        default: "active"
      },
    role: { 
        type: mongoose.Schema.ObjectId,
        ref: 'Role', // tên export ra ở model
        default: null
    },
    hash: String,
    salt: String,
    // password: {
    //     type: String,
    //     required: [true, 'Please add a password'],
    //     minlength: 6,
    //     select: false // không hiển thị mật khẩu
    // },
    // resetPasswordToken: String, // mã thông báo token khi quên pass
    resetPasswordExpire: Date, //đặt lại thời hẹn cho token khi quên pass
}, { timestamps: true });

// mã hoá mật khẩu với bcrypt
UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
// mã hoá mật khẩu với bcrypt
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }

//     //tạo salt cho mật khẩu
//     //khuyên dùng sẽ là 10 vòng lặp trong getSalt
//     //nếu số vòng lặp càng lớn thì càng an toàn nhưng nặng hệ thống
//     const salt = await bcrypt.genSalt(10);
//     console.log(salt);
//     this.password = await bcrypt.hash(this.password, salt);
// });



//Sign JWT and return token
UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this._id, 
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}
//Trả về thông tin sau khi đăng nhập
UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        image: this.image
    };
};

// So sánh mật khẩu nhập vào và mật khẩu trong DB
// trả về true/false
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//     var hash = crypto.pbkdf2Sync(enteredPassword, this.salt, 10000, 512, 'sha512').toString('hex');
//     return await bcrypt.compare(hash, this.hash);
// }

// Tạo và hash password với token
// Để phục vụ cho quên mật khẩu
UserSchema.methods.getResetPasswordToken = function () {
    // Tạo token
    const resetToken = crypto.randomBytes(16).toString('hex');
    // set lại trường resetPasswordToken
    this.hash = crypto
        .createHash('sha512')
        .update(resetToken)
        .digest('hex');

    // set thời gian hết hạn = 1ph
    this.resetPasswordExpire = Date.now() + 1 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('User', UserSchema);
var secret = require('../config/passport').secret