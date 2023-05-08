const express = require('express');
const router = express.Router();
require('../models/database');
const Player = require('../models/Player');
const Turnament = require('../models/Turnament');
const Team = require('../models/Team');
const fast2sms = require('fast-two-sms')
const axios = require('axios');

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    if (req.cookies.playerId && req.cookies.role) {
      const Turnaments = await Turnament.find();
      const latestMatches = await Turnament.find({}).sort({ date: -1 }).limit(10);
      res.render('index', { Turnaments, latestMatches });
    } else { res.redirect('/loginpage') }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.gallery = async (req, res) => {

  try {
    if (req.cookies.playerId && req.cookies.role) {
      res.render('gallery');
    } else { res.redirect('/loginpage') }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.about = async (req, res) => {

  try {
    if (req.cookies.playerId && req.cookies.role) {
      res.render('aboutus');
    } else { res.redirect('/loginpage') }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


exports.timetable = async (req, res) => {
  try {
    if (req.cookies.playerId && req.cookies.role) {
      const tournaments = await Turnament.find();
      res.render('timetable', { tournaments });
    } else { res.redirect('/loginpage') }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


exports.profile = async (req, res) => {
  try {
    const playerId = req.cookies.playerId;
    const player = await Player.findById(playerId);
    const tournaments = await Turnament.find({}, 'turnament_name');
    if (!player) {
      res.redirect("/loginpage");
      return;
    }
    res.render('profile', { player, tournaments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('playerId');
  res.clearCookie('role');
  res.redirect('/');
};

exports.addParticipant = async (req, res) => {
  const { turnament_id, team_name, wins } = req.body;
  try {
    const tournament = await Turnament.findById(turnament_id);
    if (!tournament) {
      return res.status(404).send('Tournament not found');
    }

    const participant = { team_name };
    if (wins) {
      participant.wins = wins;
    }

    tournament.partisepents.push(participant);
    await tournament.save();
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};







// Login and Sign up

exports.loginpage = async (req, res) => {
  try {
    res.render('login', { title: '@sports - Login' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occurred' });
  }
};

exports.login = async (req, res) => {
  const { userid, pass } = req.body;
  console.log('uid:', userid, 'pass', pass);
  try {
    const player = await Player.findOne({ userid });
    if (!player) {
      return res.status(401).json({ alert: 'Invalid userid or password' });
    }
    // Check if the passwords match
    if (player.pass !== pass) {
      res.redirect('/loginpage')
    }

    // Save player id and role as player in a cookie
    res.cookie('playerId', player._id, { maxAge: 3600000 });
    res.cookie('role', 'player', { maxAge: 3600000 });

    // successful login
    res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.signin = async (req, res) => {
  try {
    res.render('signin', { title: '@sports - Login' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occurred' });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    // Create a new player with the submitted data
    const player = new Player({
      name: req.body.name,
      Email: req.body.email,
      userid: req.body.userid,
      pass: req.body.pass,
      phone: req.body.phone,
      games: req.body.games,
      info: {
        father_name: req.body.father_name,
        DOB: req.body.DOB,
        age: req.body.age,
        enjures: req.body.enjures
      },
      image: "avtar.jpg",
      adharimag: "adher.jpg"
    });

    // Save the player to the database
    await player.save();

    // Redirect to the homepage
  } catch (error) {
    // Handle any errors that occur
    res.status(500).send({ message: error.message || 'Error Occurred' });
  }
};







//admin
exports.admin = async (req, res) => {
  try {
    const tournaments = await Turnament.find();
    res.render('admin', { tournaments });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.createteam = async (req, res) => {
  try {
    res.render('createteam');
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


exports.create_team = async (req, res) => {
  try {
    const { college, name, players } = req.body;

    // Create a new team document
    const newTeam = new Team();
    newTeam.college = college;
    newTeam.name = name;



    // Loop through the player names and add them to the team
    for (let playerName of players) {
      // Find the player by name in the Player collection
      const player = playerName;

      // If the player is found, add them to the team
      if (player) {
        newTeam.players.push(player);
      } else {
        // If the player is not found, return an error response
        return res.status(404).json({ error: `Player ${player} not found` });
      }
    }

    console.log('newTeam:', newTeam);

    // Save the new team document
    await newTeam.save();

    // Return a success response
    return res.redirect('teams')
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.teams = async (req, res) => {
  try {
    if (req.cookies.playerId && req.cookies.role) {
      const teams = await Team.find();
      res.render('teams', { teams });
    } else {
      res.redirect('/loginpage')
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTurnament = async (req, res) => {
  const { turnament_name, admin, admin_pass, location } = req.body;

  try {
    const turnament = new Turnament({
      turnament_name,
      admin,
      admin_pass,
      location,
    });

    await turnament.save();
    res.send('Turnament created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

exports.addMatch = async (req, res) => {
  try {
    const { tournament_name, team1_name, team2_name, round, date } = req.body;

    // Find the tournament based on its name
    const tournament = await Turnament.findOne({ turnament_name: tournament_name });
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    // Find the teams based on their names
    const team1 = tournament.partisepents.find(partisepent => partisepent.team_name === team1_name);
    const team2 = tournament.partisepents.find(partisepent => partisepent.team_name === team2_name);
    if (!team1 || !team2) {
      throw new Error('Team not found');
    }

    // Create the new match object
    const match = {
      team1: team1_name,
      team2: team2_name,
      round: round,
      date: date,
    };

    // Add the match to the tournament's matches array
    tournament.matches.push(match);

    // Save the updated tournament
    await tournament.save();

    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding match');
  }

};

// send sms


async function sendSMS(phoneNumber, message) {
  try {
    const response = await fast2sms.sendMessage({
      authorization: process.env.API_KEY,
      message: message,
      numbers: [phoneNumber]
    });
    console.log(response)
    console.log(message, phoneNumber);
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

exports.announcement = async (req, res) => {
  try {
    const message = req.body.message;
    const players = await Player.find();

    players.forEach(player => {
      sendSMS(player.phone, message);
    });

    res.send('Announcement sent to all players');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }

};






