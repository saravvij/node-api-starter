const express = require('express');
const UserModel = require('../models/user-model');
const router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  }
  
  UserModel.create(user)
    .then(result => {
      console.info('Created user Successfully id=' + result._id);
      res.status(201).send({
        "id": result._id
      });
    })
    .catch(e => {
      console.log("Failed to create new user");
      res.status(500).send({
        "message": "Unable to create new user"
      });
    });

});

module.exports = router;