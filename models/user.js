let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name:{
        type: 'string',
        required: true,
        unique: true
    },
    pass:{
        type: 'string',
        required: true
    }
})

let User = module.exports = mongoose.model('User',UserSchema);