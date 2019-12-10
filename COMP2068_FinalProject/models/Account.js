var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        phone: String,
        img: String //- Sehee
    }
);

module.exports = mongoose.model('Account', AccountSchema);
