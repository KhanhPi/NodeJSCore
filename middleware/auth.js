// const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
var jwt = require('express-jwt');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

module.exports = {
     secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
};

var secret = module.exports.secret;

// xác thực khi gọi các api
exports.protect = {
    // let token ;

    // if (req.headers.authorization &&
    //     req.headers.authorization.startsWith('Token') ||
    //     req.headers.authorization.startsWith('Bearer')) {
    //     // cắt chuỗi khi gặp khoảng trống
    //     // lấy chuỗi thứ 2 sau khi cắt gán cho token
    //     token = req.headers.authorization.split(' ')[1];
    // }

    // kiểm tra token đã tốn tại chưa?
    // if (!token) {
    //     return next(new ErrorResponse('Not authorize to access this route', 401));
    // } 

    // try {
    //     // xác thực token
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     // đặt cho người dùng bắt đầu yêu cầu này
    //     req.user = await User.findById(decoded.id);
    //     next();
    // } catch (err) {
    //     return next(new ErrorResponse('Not authorize to access this route', 401));
    // }
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
}; 

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        // cắt chuỗi khi gặp khoảng trống
        // lấy chuỗi thứ 2 sau khi cắt gán cho token
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// phân quyền cho các user
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Not authorize to access this route', 401));
        }
        next();
    }
}

