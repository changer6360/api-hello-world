var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle.js');

// Configure the app for bodyParser()
// lets grab the data from the body of POST

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// Connect to DB
mongoose.connect('mongodb://localhost:27017/codealong');

// API Routes
var router = express.Router();

// Routes will be prefixed with /API

app.use('/api',router);

// MIDDLEWARE
// Middleware can be very useful for validations. It can log things
// from here to stop the request from continuing in the event
// that the request is not safe.
//middleware to use for all requests
router.use(function(req, res, next) {
console.log('Currently processing some things...');

  next();
});

// Test Routes
router.get('/', function(req, res) {
  res.json({message: 'Welcome to our API!'});
});

router.route('/vehicles')

  .post(function(req, res) {
    var vehicle = new Vehicle(); //new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json({message: 'Vehicle was successfully created'});

    });
  })

    .get(function(req, res) {
      Vehicle.find(function(err, vehicles) {
        if (err) {
          res.send(err);
        }
        res.json(vehicles);
      });
    });

    router.route('/vehicle/:vehicle_id')
    .get(function(req, res) {
      Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
        if (err) {
          res.send(err);
        }
        res.json(vehicle);
      });
    });

    router.route('/vehicle/make/:make')
    .get(function(req, res) {
      Vehicle.find({make:req.params.make}, function(err, vehicle) {
        if (err) {
          res.send(err);
        }
        res.json(vehicle);
      });
    });

    router.route('/vehicle/color/:color')
    .get(function(req, res) {
      Vehicle.find({color:req.params.color}, function(err, vehicle) {
        if (err) {
          res.send(err);
        }
        res.send(vehicle);
      });
    });

// Fire up the server
app.listen(port);

// Print friend message to the console
console.log('Server currently listening on port ' + port );
