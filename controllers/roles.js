const Role = require('../models/roles');
const asyncHandler = require('../middleware/async');

// @desc    Get Add role
// @route   POST /api/roles/
exports.createRole = asyncHandler(async(req, res, next) => {
    const role = await Role.create(req.body);

    res.status(201).json({
        success: true,
        data: role
    });
})