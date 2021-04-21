import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as TwitterStrategy } from "passport-twitter";
import passportKeys from "../passportKeys.js";

const {
  TWITTER_CONSUMER_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWIITER_CONSUMER_KEY,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
} = passportKeys;

const facebookPassportConfig = () => {
  return passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
        profileFields: ["id", "displayName", "name", "email", "picture"],
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, cb) {
        try {
          if (profile) {
            req.user = profile;
            req.body.headingTo = "join";
            cb(null, profile);
          }
        } catch (error) {
          cb(error);
        }
      }
    )
  );
};

const googlePassportConfig = () => {
  return passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
        profileFields: [
          "id",
          "displayName",
          "name",
          "email",
          "picture",
          "description",
        ],
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, cb) {
        try {
          if (profile) {
            req.user = profile;
            cb(null, profile);
          }
        } catch (error) {
          cb(error);
        }
      }
    )
  );
};

const githubPassportConfig = () => {
  return passport.use(
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/github/callback`,
        profileFields: [
          "id",
          "displayName",
          "name",
          "email",
          "picture",
          "description",
        ],
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, cb) {
        try {
          if (profile) {
            req.user = profile;
            cb(null, profile);
          }
        } catch (error) {
          cb(error);
        }
      }
    )
  );
};

const twitterPassportConfig = () => {
  return passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWIITER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.API_URL}/auth/twitter/callback`,
        profileFields: [
          "id",
          "displayName",
          "name",
          "email",
          "picture",
          "description",
        ],
        passReqToCallback: true,
      },
      function (req, token, tokenSecret, profile, cb) {
        try {
          if (profile) {
            req.user = profile;
            cb(null, profile);
          }
        } catch (error) {
          cb(error);
        }
      }
    )
  );
};

const passportConfig = () => {
  return Promise.all([
    facebookPassportConfig(),
    googlePassportConfig(),
    githubPassportConfig(),
    twitterPassportConfig(),
  ]);
};

export default passportConfig;
