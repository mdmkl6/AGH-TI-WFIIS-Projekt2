let mongoose = require('mongoose');

let questSchema = mongoose.Schema({
    ilosc:{
        type: 'decimal',
        required: true
    },
    marka:{
        type: 'string',
        required: true
    },
    cena:{
        type: 'string',
        required: true
    },
    male:{
        type: 'string',
        required: true
    },
    wiek:{
        type: 'string',
        required: true
    }
})

let Quest = module.exports = mongoose.model('Quest',questSchema);