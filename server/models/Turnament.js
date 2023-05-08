const mongoose = require('mongoose');
const Team = require('../models/Team');

const partisepentsSchema = new mongoose.Schema({
  team_name: {
    type:String

  },
  wins: {
    type: Number,
   
  },
});

const matchesSchema = new mongoose.Schema({
  round: {
    type: String,
    required: 'This field is required.'
  },
  team1: {
    type:String
   },
  team2: {
    type:String

  },
  date: {
    type: String,
    required: 'This field is required.'
  },
  result: {
    type: String,
  },
  notes: {
    type: String,
  },
});

const turnamentSchema = new mongoose.Schema({
  turnament_name: {
    type: String,
    required: 'This field is required.'
  },
  admin: {
    type: String,
    required: 'This field is required.'
  },
  admin_pass: {
    type: Number,
    required: 'This field is required.'
  },
  location: {
    type: String,
    required: 'This field is required.'
  },
  partisepents: {
    type: [partisepentsSchema],
    maxlength: 20
  },
  matches: [matchesSchema]
});

module.exports = mongoose.model('Turnament', turnamentSchema);