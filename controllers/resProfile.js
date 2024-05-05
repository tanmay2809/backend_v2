const RestaurantProfile = require("../models/ResturantProfile");
const RestaurantDetails = require("../models/restaurantDetails");



const updateRestaurantProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract restaurant details ID from request parameters

    // Find the restaurant details by ID
    const restaurantDetails = await RestaurantDetails.findById(id);

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    // Get the ID of the associated restaurant profile
    const restaurantProfileId = restaurantDetails.profile;

    // Find the restaurant profile by ID
    let restaurantProfile = await RestaurantProfile.findById(
      restaurantProfileId
    );

    if (!restaurantProfile) {
      return res.status(404).json({ error: "Restaurant profile not found" });
    }

    // Extract updated data from the request body
    const {
      name,
      image,
      email,
      contactNo,
      contactPerson,
      outletAddress,
      businessType,
      cuisine,
      instaLink,
      fssaiLicenseNo,
    } = req.body;

    // Update the restaurant profile fields
    restaurantProfile.name = name;
    restaurantProfile.image = image;
    restaurantProfile.email = email;
    restaurantProfile.contactNo = contactNo;
    restaurantProfile.contactPerson = contactPerson;
    restaurantProfile.outletAddress = outletAddress;
    restaurantProfile.businessType = businessType;
    restaurantProfile.cuisine = cuisine;
    restaurantProfile.instaLink = instaLink;
    restaurantProfile.fssaiLicenseNo = fssaiLicenseNo;

    // Save the updated restaurant profile to the database
    restaurantProfile = await restaurantProfile.save({ new: true });

    // Send a success response with the updated restaurant profile
    res.status(200).json({
      message: "Restaurant profile updated successfully",
      restaurantProfile,
    });
  } catch (error) {
    // Handle errors
    console.error("Error updating restaurant profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRestaurantProfileById= async (req, res) => {
  try {
    const { id } = req.params; // Extract restaurant details ID from request parameters

    // Find the restaurant details by ID
    const restaurantDetails = await RestaurantDetails.findById(id);

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    // Find the corresponding restaurant profile using the profile field in restaurant details
    const restaurantProfile = await RestaurantProfile.findById(
      restaurantDetails.profile
    );

    if (!restaurantProfile) {
      return res.status(404).json({ error: "Restaurant profile not found" });
    }

    res.status(200).json(restaurantProfile); // Send restaurant profile data as response
  } catch (error) {
    // Handle errors
    console.error("Error fetching restaurant profile by details ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const addRestaurantProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract restaurant details ID from request parameters

    // Find the restaurant details by ID
    let restaurantDetails = await RestaurantDetails.findById(id);

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    // Extract necessary data from the request body
    const {
      name,
      image,
      email,
      contactNo,
      contactPerson,
      outletAddress,
      businessType,
      cuisine,
      instaLink,
      fssaiLicenseNo,
    } = req.body;

    // Create a new restaurant profile
    const restaurantProfile = new RestaurantProfile({
      name,
      image,
      email,
      contactNo,
      contactPerson,
      outletAddress,
      businessType,
      cuisine,
      instaLink,
      fssaiLicenseNo,
    });

    // Save the restaurant profile to the database
    await restaurantProfile.save();

    // Update the restaurant details with the new profile reference
    restaurantDetails.profile = restaurantProfile._id;
    restaurantDetails.name = name;
    restaurantDetails.contact=contactNo;
    restaurantDetails.cuisineServed = cuisine;
    restaurantDetails = await restaurantDetails.save({ new: true });

    // Send a success response
    res.status(201).json({
      message: "Restaurant profile added successfully",
      restaurantProfile,
    });
  } catch (error) {
    // Handle errors
    console.error("Error adding restaurant profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  addRestaurantProfile,
  getRestaurantProfileById,
  updateRestaurantProfile,
};
