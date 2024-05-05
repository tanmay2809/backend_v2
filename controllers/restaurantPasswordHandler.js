const restaurantLogin = require('../models/restaurantLogin');

const bcrypt = require("bcrypt");

const { otpGen } = require("otp-gen-agent");