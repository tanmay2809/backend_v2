const Otp = require("../models/otpSchema");
const mailSender = require("../utils/mailSender");
const { sendOtpEmail } = require("../mail/template/sendOtpEmail");
const restaurantLogin = require("../models/restaurantLogin");
const otpGenerator = require("otp-generator");

const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
    console.log("ffff")
  // Check if an OTP already exists and is not expired
  let otpRecord = await Otp.findOne({ email });
  console.log(otpRecord)
  //console.log(otpRecord.createdAt.getTime());

  if (otpRecord) {
    const currentTime = Date.now();
    const otpAge = (currentTime - otpRecord.createdAt.getTime()) / 1000;
    console.log(otpAge)
    console.log("bhbgyh1");

    // Resend the existing OTP if it is still valid
    if (otpAge < 300) {
      try {
        await mailSender(email, "Greetings From Snackbae", sendOtpEmail(otpRecord.otp));
        return res.status(200).json({ message: "OTP sent successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Error sending OTP" });
      }
    } else {
      // Delete the expired OTP record
      //await Otp.deleteOne({ email });
    
    }
    } 

    console.log("bhbgyh");

  // Generate a new OTP using otp-generator
const otp = otpGenerator.generate(6, {
  digits: true,
  alphabets: false,
  upperCase: false,
  specialChars: false,
});
console.log(otp);
  otpRecord = await Otp.create({ email, otp });

  try {
    const mail = await mailSender(email, "Greetings From Snackbae", sendOtpEmail(otp));
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const record = await Otp.findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ error: "Invalid OTP or expired OTP" });
  }

  // Check if the OTP is older than 5 minutes
  const currentTime = new Date();
  const otpTime = new Date(record.createdAt); // Assuming createdAt field is present
  const timeDifference = (currentTime - otpTime) / (1000 * 60); // Difference in minutes

  if (timeDifference > 5) {
    return res.status(400).json({ error: "OTP has expired", otpexpired: true });
  }

  res
    .status(200)
    .json({ message: "OTP verified successfully", otpexpired: false });
};

const checkEmailExistence = async (req, res) => {
  const  {email}  = req.body;
  console.log(req.body)

  

  try {
    // Check if the email already exists
    const existingUser = await restaurantLogin.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { sendOtp, verifyOtp, checkEmailExistence };
