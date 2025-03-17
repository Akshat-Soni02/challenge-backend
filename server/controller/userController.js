import ErrorHandler from "../middlewares/error.js";
import user from "../models/user.js";
import { sendToken } from "../utils/features.js";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  console.log("logging.....");
  try {
    const { email, password } = req.body;
    const curUser = await user.findOne({ email }).select("+password");
    if (!curUser)
      return next(new ErrorHandler("Invalid Email or Password", 404));
    const isMatch = await bcrypt.compare(password, curUser.password);
    if (!isMatch) return next(new ErrorHandler("Invalid Password", 404));
    sendToken(curUser, res, `Hey ${curUser.name} glad to have you back`, 200);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  console.log("registering....")
  try {
    const { email, password } = req.body;
    let curUser = await user.findOne({ email });
    if (curUser) return next(new ErrorHandler("User Already Exist", 404));

    const name = email.split("@")[0]; 

    const hashedPassword = await bcrypt.hash(password, 10);
    curUser = await user.create({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      password: hashedPassword,
    });

    sendToken(curUser, res, "Welcome to Challenge", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = async (req, res) => {
  console.log("logging out..");
  res.status(200).json({
    message: "Successfully logged out"
  });
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;
    const curUser = await user.findById(id);

    if (!curUser) {
      return next(new ErrorHandler("User does not Exist", 404));
    }

    if (updatedDetails.name) {
      curUser.name = updatedDetails.name;
    }
    await curUser.save();
    return res.status(200).json({ message: "Details updated successfully" });
  } catch (error) {
    next(error);
  }
};
