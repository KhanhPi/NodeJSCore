const jwt = require('jsonwebtoken');
// var jwt = require('express-jwt');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
var secret = require('../config/passport').secret


const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
// xác thực khi gọi các api
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    //     req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Token') ||
        req.headers.authorization.startsWith('Bearer')) {
        // cắt chuỗi khi gặp khoảng trống
        // lấy chuỗi thứ 2 sau khi cắt gán cho token
        token = req.headers.authorization.split(' ')[1];
    }

    // kiểm tra token đã tốn tại chưa?
    // if (!token) {
    //     return next(new ErrorResponse('Not authorize to access this route1', 401));
    // }

    try {
        // xác thực token
        const decoded = jwt.verify(token, secret);
        // đặt cho người dùng bắt đầu yêu cầu này
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorize to access this route2', 401));
    }
});

// phân quyền cho các user
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Not authorize to access this route', 401));
        }
        next();
    }
}