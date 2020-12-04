const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    user: String,
    password: String
}, {
    timestamps: true
});

module.exports = model('User', userSchema);