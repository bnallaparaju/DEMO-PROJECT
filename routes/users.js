var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');


router.post('/', function (req, res, next) {
  // console.log(req.body);
  var personInfo = req.body;


  if (personInfo.email && personInfo.password && personInfo.name) {

    User.findOne({
      email: personInfo.email
    }, function (err, data) {
      if (!data) {

        var newPerson = new User({
          email: personInfo.email,
          name: personInfo.name,
          password: personInfo.password
        });

        newPerson.save(function (err, Person) {
          if (err)
            return res.status(500).send(err)
          else
            return res.status(201).send(Person);
        });
      } else {
        return res.status(400).send({
          "result": "Email is already used."
        });
      }

    });
  }
});

router.post('/login', function (req, res, next) {
  //console.log(req.body);
  if (req.body && req.body.email && req.body.password) {
    User.findOne({
        email: req.body.email
      })
      .exec(function (err, user) {
        if (err) {
          return res.status(500).send(err)
        } else if (!user) {
          return res.status(401).send({
            error: new Error('user not found')
          })
        }
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result === true) {
            return res.status(200).send({
              result: 'logged successfully'
            });
          } else {
            return res.status(500).send({
              error: new Error('user not found')
            })
          }
        })
      });
  }

});

router.get('/getusers', function (req, res, next) {
  console.log("profile");
  User.find({}, function (err, data) {
    if (data && data.length > 0) {
      return res.status(200).send(data)
    } else {
      return res.status(500).send({
        error: new Error('not found')
      })
    }
  });
});


module.exports = router;