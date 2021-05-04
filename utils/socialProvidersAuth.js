import jwt from "jsonwebtoken";
import { users } from "../database/utils/injector.js";

export const socialAuth = async (req, res) => {
  const {
    id,
    displayName,
    username,
    emails,
    photos: [{ value }],
  } = req.user;

  const { description, bio } = req.user._json;

  try {
    // Find user in the database

    const user = await users.findOne({ providerId: id });
    let token;

    if (!user) {
      // User not found --> new user --> create new user in the database
      const newUser = await users.insertOne({
        name: displayName ? displayName : username,
        email: emails ? emails[0].value : null,
        providerId: id,
        avatar: value,
        about: description ? description : bio,
        hosted: [],
        pts: 0,
      });

      // Send cookie to frontend

      token = await jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30days",
      });
    } else {
      token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30days",
      });
    }
    const data = user ? user : newUser;
    console.log("token", token);

    res.cookie("jwt", token);
    res.redirect(`${process.env.CLIENT_URL}/app/`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
};
