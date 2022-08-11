const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Outpass = mongoose.model('Outpass');
const requireLogin = require('../middlewares/requireLogin');
const { generate_token } = require('../services/outpassService');

router.post('/generateoutpass', requireLogin, (req, res) => {
  const { hostel, roomno, purpose, transport, from_time, to_time } = req.body;
  if (!hostel || !roomno || !purpose || !transport || !from_time || !to_time) {
    return res.status(422).json({ error: 'Please fill all the details to proceed!' });
  }

  const uniqueToken = generate_token(16);

  const outpass_record = new Outpass({
    name: req.user,
    hostel: hostel,
    roomno: roomno,
    purpose: purpose,
    transport: transport,
    from: from_time,
    to: to_time,
    token: uniqueToken
  })

  outpass_record.save().then((result) => {
    res.json({ token: uniqueToken, outpass: result })
  })
    .catch((err) => {
      console.error("Outpass save error: " + err)
    })
});

module.exports = router;