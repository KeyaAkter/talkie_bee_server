const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");

// generate token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// registering a user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json("Email already exist!");
    }

    // validating empty fields
    if (!name || !email || !password) {
      return res.status(400).json("All fields should be filled!");
    }

    // validating email
    if (!validator.isEmail(email)) {
      res.status(400).json("Invalid Email!");
    }

    // checking strong password
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json(
          "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol. Please try again with a stronger password."
        );
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
    res.status(500).json(err); //server error
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json("Invalid email or password!");
    }

    // compairing password
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(400).json("Incorrect Password!");
    }

    // creating a new token
    const token = createToken(existingUser._id);

    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      email,
      password: existingUser.password,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// finding an user
const findUser = async (req, res) => {
  const { userId } = req.params;

  // checking mongodb id validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("Invalid Id!");
  }

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getAllUsers,
};
