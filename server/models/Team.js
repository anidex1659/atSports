const mongoose = require('mongoose');
const Player = require('./Player');

const teamSchema = new mongoose.Schema({
  college: {
    type: String
  },
  name: {
    type: String,
    required: 'This field is required.'
  },
  players: [{
    type: String
  }]
});

module.exports = mongoose.model('Team',teamSchema );
