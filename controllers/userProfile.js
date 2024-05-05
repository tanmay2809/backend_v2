const userProfile = require('../models/userProfile');

const addUser = async(req,res) => {
    try {
        const { profileImage, fullName, gender, contact, email, dob ,foodPreference, anniversary } = req.body;

        const newUser = new userProfile({
            profileImage,
            name : fullName,
            gender,
            contact,
            email,
            dob,
            foodPreference,
            anniversary,
        });

        const savedUser = await newUser.save();

        res.status(201).json({ 
            message: "User added successfully",
            user: savedUser 
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};


const checkContactExists = async (req, res) => {
    try {
        const { phoneNumber } = req.params;

        const user = await userProfile.findOne({ contact: phoneNumber });

        if (user) {
            return res.status(201).json({ 
                exists: true, 
                message: 'Contact exists',
                data:user, 
            });
        } else {
            return res.status(201).json({ 
                exists: false, 
                message: 'Contact does not exist',
                data:user,
        });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const existingUser = await userProfile.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract updated data from the request body
    const {
      
      fullName,
      gender,
      
      email,
      dob,
      foodPreference,
      anniversary,
    } = req.body;

    // Update user details
    existingUser.name = fullName 
    existingUser.gender = gender 

    existingUser.email = email 
    existingUser.dob = dob 
    existingUser.foodPreference = foodPreference ;
    existingUser.anniversary = anniversary ;

    // Save the updated user
    const updatedUser = await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { addUser, updateUser,checkContactExists };