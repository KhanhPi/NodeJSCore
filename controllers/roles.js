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

//getByID
exports.getById = asyncHandler(async (req, res, next) => {
    Role.findById(req.params.id).then(function (role) {
        if (!role) { return res.sendStatus(401); }
        return res.json({ data: role });
    }).catch(next);
})

//GetAll Role
exports.getAll = asyncHandler(async (req, res, next) => {
    Role.find().then(function (role) {
        return res.json({ data: role });
    }).catch(next);
})

//UpdateRole
exports.updateRole = asyncHandler(async (req, res, next) => {
    Role.findByIdAndUpdate(req.params.id, req.body.role, {new: true}).then(function(role) {       
        if (!role) { return res.sendStatus(401); }
        return res.json({data: role})
    }).catch(next)
})

//Delete Role
exports.deleteRole = asyncHandler(async(req, res, next) => {
    Role.findByIdAndDelete(req.params.id).then(function(role) {
        if(!role) {return res.sendStatus(401);}
        return res.json({data: role})
    }).catch(next)
})