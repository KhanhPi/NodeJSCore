const Role = require('../models/Role');
const asyncHandler = require('../middleware/async');

// @desc    Get Add role
// @route   POST /api/roles/
exports.createRole = asyncHandler(async (req, res, next) => {
    var role = new Role(req.body.role);
    role.save().then(function () {
        return res.json({ data: role });
    }).catch(next);
})


exports.getById = asyncHandler(async (req, res, next) => {
    Role.findById(req.params.id).then(function(role) {
        if (!role) { return res.sendStatus(401); }
        return res.json({ data: role });
    }).catch(next);
})

exports.getAll = asyncHandler(async (req, res, next) => {
    Role.find().then(function(role) {
        if (!role) { return res.sendStatus(401); }
        return res.json({ data: role });
    }).catch(next);
})