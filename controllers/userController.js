const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// generate token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// registering user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json("Email already exist!");
    }

    // validation
    if (!name || !email || !password) {
      return res.status(400).json("All fields should be filled!");
    }

    if (!validator.isEmail(email)) {
      res.status(400).json("Invalid Email!");
    }

    // checking strong password
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json("Your password isn't strong.Give a strong password!");
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // creating an user
    const user = await userModel.create({ name, email, password: hash });

    // creating a token
    const token = createToken(user._id);

    res
      .status(200)
      .json({ id: user._id, name, email, password: user.password, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
};
