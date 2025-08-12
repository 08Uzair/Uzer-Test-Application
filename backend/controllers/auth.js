import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
const secret = "uzer";

// SIGN IN

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "7d",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// SIGN UP

export const signup = async (req, res) => {
  const { name, email, password, image, createdAt } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      createdAt,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "7d",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    error;
  }
};

// Sign In
// 1. User Exist
// if exist then create a token and send the token to the frontend
// if user not exist then sign up page
// take username , email ,password ,  and store them in result variablr
// Check it is old user or not
// if not then proceed to generating the token using JWT  and store the token in token variable
// and at last give the token and result variable as response

//  GET USER BY ID

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    error;
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL USERS

export const getUser = async (res) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed" });
  }
};
