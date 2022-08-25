const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Outpass = mongoose.model('Outpass');
const requireLogin = require('../middlewares/requireLogin');


router.get('/pendingoutpasses', requireLogin, (req, res) => {
  if (req.user.role == 'Admin') {
    Outpass.find({ status: "Pending" })
      .then((outpass_record) => {
        console.log("Pending Outpass_record fetch success: " + outpass_record);
        res.json({ outpass_record });
      })
      .catch((err) => {
        console.error("Pending Outpass_record fetch error: " + err);
      })
  }
  else {
    res.json({ message: "Student not allowed." });
  }
});

router.post('/approveoutpass/:outpassid', requireLogin, (req, res) => {
  if (req.user.role == 'Admin') {
    Outpass.findByIdAndUpdate(req.params.outpassid, {
      status: "Approved"
    }, {
      new: true
    })
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ approve_outpass_error: err });
        } else {
          res.json({ result: result });
        }
      })
  }
  else {
    res.json({ message: "Student not allowed." });
  }
});

module.exports = router;