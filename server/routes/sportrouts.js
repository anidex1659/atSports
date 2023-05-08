// router.js

const express = require('express');
const router = express.Router();
const sportcontroller = require('../controllers/sportcontroller');

router.get('/', (req, res) => {
  sportcontroller.homepage(req, res);
});

router.get('/loginpage', (req, res) => {
  sportcontroller.loginpage(req, res);
});

router.post('/login', (req, res) => {
  sportcontroller.login(req, res);
});

router.get('/signin', (req, res) => {
  sportcontroller.signin(req, res);
});

router.post('/createa', (req, res) => {
  sportcontroller.createPlayer(req, res);
});



router.get('/gallery', (req, res) => {
  sportcontroller.gallery(req, res);
});

router.get('/about', (req, res) => {
  sportcontroller.about(req, res);
});

router.get('/admin', (req, res) => {
  sportcontroller.admin(req, res);
});

router.get('/createteam', (req, res) => {
  sportcontroller.createteam(req, res);
});

router.post('/create-team', (req, res) => {
  sportcontroller.create_team(req, res);
});

router.get('/teams', (req, res) => {
  sportcontroller.teams(req, res);
});

router.post('/create_turnament', (req, res) => {
  sportcontroller.createTurnament(req, res);
});

router.get('/profile', (req, res) => {
  sportcontroller.profile(req, res);
});

router.post('/addParticipant', (req, res) => {
  sportcontroller.addParticipant(req, res);
});

router.post('/addMatch', (req, res) => {
  sportcontroller.addMatch(req, res);
});

router.get('/timetable', (req, res) => {
  sportcontroller.timetable(req, res);
});

router.get('/logout', (req, res) => {
  sportcontroller.logout(req, res);
});

router.post('/announcement', (req, res) => {
  sportcontroller.announcement(req, res);
});

module.exports = router;
