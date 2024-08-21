import Signup from "../models/AuthModel.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from "../helper/CloudinaryConfig.js";

export const addAccount = async (req, res) => {
    try {

        const upload = await cloudinary.uploader.upload(req.file.path);

        const { name, email, password, isAdmin, profile, address, dob } = req.body

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const addDetails = new Signup({
            name: name,
            profile: upload.secure_url,
            email: email,
            password: hashedPassword,
            dob,
            address,
            isAdmin,
        })
        const result = await addDetails.save()
        res.status(200).json({ result: result, msg: "Account created successfully" })
    } catch (error) {
        console.log('Failed To Signup', error)
    }
}


export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Signup.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Wrong Credentials. Please try again." });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Wrong Credentials. Please try again." });
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '236h' });
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Failed to login:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'An error occurred' });
        }
    }
};


export const auth = async (req, res) => {
    try {
        const user = await Signup.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};


export const FindUserById = async (req, res) => {
    try {
        const user = await Signup.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};


export const getAllusers = async (req, res) => {
    try {
        const getAllUsers = await Signup.find()
        res.status(200).json(getAllUsers)
    } catch (error) {
        console.log(error)
    }
}


export const deleteStudent = async (req, res) => {
    try {
        const response = await Signup.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred' });
    }
}

// export const UpdateStudentById = async (req, res) => {
//     try {
//         const response = await Signup.findByIdAndUpdate(req.params.id, req.body, { new: true })
//         res.status(200).json(response)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: 'An error occurred' });

//     }
// }


export const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isAdmin, address, dob, profile } = req.body;

        const updateData = { name, email, address, dob, isAdmin,  };

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            updateData.profile = upload.secure_url;
        }

        const updatedAccount = await Signup.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAccount) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        res.status(200).json(updateAccount);
    } catch (error) {
        console.error('Failed to update account:', error);
        res.status(500).json({ success: false, message: "Failed to update account" });
    }
};

export const countAllstudents = async (req, res) => {
    try {
      const totalStudentCount = await Signup.countDocuments({});
      res.status(200).json({ count: totalStudentCount });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while counting Students documents", error: error });
    }
  };