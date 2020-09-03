const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleName: String,
    description: String,
    status: {
        type: String,
        default: "active"
    }
}, { timestamps: true });


module.exports = mongoose.model('Role', RoleSchema);