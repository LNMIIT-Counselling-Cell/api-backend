const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Outpass = mongoose.model('Outpass');
const requireLogin = require('../middlewares/requireLogin');

router.get('/pendingoutpasses', requireLogin, (req, res) => {
  Outpass.find({ status: "Pending" })
    .then((outpass_record) => {
      console.log("Pending Outpass_record fetch success: " + outpass_record);
      res.json({ outpass_record });
    })
    .catch((err) => {
      console.error("Pending Outpass_record fetch error: " + err);
    })
});

router.post('/approveoutpass/:outpassid', requireLogin, (req, res) => {
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
});

module.exports = router;