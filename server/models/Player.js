const mongoose = require('mongoose');

const validator= require('validator')

const infoSchema = new mongoose.Schema({
    father_name: {
        type: String,
        required: 'This field is required.'
      },
      DOB: {
        type: String,
        required: 'This field is required.'
      },
      age: {
        type: Number,
        required: 'This field is required.'
      },
      enjures: {
        type: String,
        required: 'This field is required.'
      },
})

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
  Email: {
    type: String,
    required: 'This field is required.',
    validator(value){
        if(! validator.isEmail(value))
        {
            throw new Error("invalide email");
        }
    }
  },
  userid: {
    type: String,
    required: 'This field is required.'
  },
  pass: {
    type: String,
    required: 'This field is required.'
  },
  phone: {
    type: Number,
    required: 'This field is required.'
    
  },
  adharimag: {
    type: String,
    required: 'This field is required.'
  },
  games: [{
    type: String,
    required: 'This field is required.'
  }],
  info: infoSchema,

  
});

module.exports = mongoose.model('Player',playerSchema );