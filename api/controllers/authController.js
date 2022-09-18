import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

// sign up:
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    const { password, ...others } = newUser._doc;

    return res.status(200).json(others);
  } catch (err) {
    return next(err);
  }
};

// sign in:
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const validate = bcrypt.compareSync(req.body.password, user.password);
    if (!validate) return next(createError(400, "Wrong identities!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    const { password, ...others } = user._doc;

    res.cookie("token", token, {
      expires: new Date(Date.now() + 9999999),
      httpOnly: true,
    });

    return res.status(200).json({ ...others, token });
  } catch (err) {
    return next(err);
  }
};

// sign in with google:
export const signinWithGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      res.cookie("shareToken", token, {
        expires: new Date(Date.now() + 9999999),
        httpOnly: true,
      });

      return res.status(200).json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      res.cookie("shareToken", token, {
        expires: new Date(Date.now() + 9999999),
        httpOnly: true,
      });

      return res.status(200).json(newUser._doc);
    }
  } catch (err) {
    return next(err);
  }
};
