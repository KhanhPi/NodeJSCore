const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const passport = require('passport');


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
            return res.json({ user: user.toAuthJSON(), id: user._id });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

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
});

//Lấy all user 
exports.getAll = asyncHandler(async (req, res, next) => {
    User.find().then(function (user) {
        return res.json({ data: user });
    }).catch(next)
});

//GetById user
exports.getById = asyncHandler(async (req, res, next) => {
    User.findById(req.params.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        return res.json({ data: user })
    }).catch(next);
})

//Update User
exports.updateUser = asyncHandler(async (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body.user, { new: true }).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        return res.json({ data: user });
    }).catch(next)
})

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

// @desc    Register user
// @route   POST /api/auth/register
exports.addUser = asyncHandler(async (req, res, next) => {
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    user.address = req.body.user.address;
    user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});