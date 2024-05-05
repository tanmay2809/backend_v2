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

module.exports = { addUser,checkContactExists };