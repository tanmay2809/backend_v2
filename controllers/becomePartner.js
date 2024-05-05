// Import the BecomePartner model
const BecomePartner = require("../models/becomePartner");
const mailSender = require("../utils/mailSender");
const { becomePartnerEmail } = require("../mail/template/becomePartnerEmail");
// Define the function to save become partner data to the database
const becomePartnerDataToDB = async (req, res) => {
  try {
    // Extract data from the request body
    const { brandName, contactNumber, email } = req.body;

    // Create a new instance of the BecomePartner model
    const newPartner = new BecomePartner({ brandName, contactNumber, email });

    // Save the data to the database
    const savedData = await newPartner.save();
    const mail = await mailSender(
      email,
      "Greetings From Snackbae",
      becomePartnerEmail()
    );
    res.status(201).json({
      success: true,
      savedData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

// Define the function to fetch all become partner data from the database
const getAllBecomePartners = async (req, res) => {
  try {
    // Fetch all become partner data from the database
    const partners = await BecomePartner.find();

    // Check if any data is found
    if (!partners || partners.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    // If data is found, send it in the response
    res.status(200).json({ success: true, partners });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAllBecomePartners, becomePartnerDataToDB };
