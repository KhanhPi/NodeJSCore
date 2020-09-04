const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const passport = require('passport');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password)
    user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body.user;
    // Validate email & password
    if (!email || !password) {
        // return res.status(422).json({errors: {email: "can't be blank"}});
        return next(new ErrorResponse('Please provide an email and password', 422))
    }

    // check for user
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) { return next(err) }
        if (user) {
            // user.roles = req.body.role
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON(), data: user._id });
        } else {
            return res.status(422).json(info);
        }
    })


    // // findOne tìm kiếm theo email + với password
    //  await User.findOne({ email }).then(function(u){
    //     // console.log("user", u);
    //     const salt = u.salt;
    //     console.log("user", salt);
    // });


    // if (!user) {
    //     return next(new ErrorResponse('Invalid credentials', 401));
    // }

    // // Kiểm tra quyền của user
    // // if (user.role !== 'admin') {
    // //     return next(new ErrorResponse('Not authorize', 401));
    // // }

    // // kiểm tra password
    // const isMatch = await user.matchPassword(password);
    // if (!isMatch) {
    //     return next(new ErrorResponse('Invalid credentials', 401));
    // }
    // sendTokenResponse(user, 200, res);
});


// Lấy token từ model, tạo cookie và gửi phản hồi
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        })
};

// @desc    Get current logged in user
// @route   POST /api/auth/me
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
        path: 'role',
        select: 'name'
    })

    res.status(200)
        .json({
            success: true,
            data: user
        })
})

// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse('Not User', 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    })
})