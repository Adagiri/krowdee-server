import cors from "cors";
import dotEnv from "dotenv";
dotEnv.config();
import express from "express";
import Session from "express-session";
import passport from "passport";

import { connection } from "./database/utils/index.js";
import passportConfig from "./utils/passport.js";
import { socialAuth } from "./utils/socialProvidersAuth.js";
import server from "./server.js";

passportConfig();

const app = express();
app.use(cors());
app.use(express.json());
app.use(Session({ secret: process.env.SESSION || "keyboard cat", resave: true, saveUninitialized: true }));
const PORT = process.env.PORT || 3000;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

///////////////////////
///////////////////////
///////////////////////////

//Facebook auth route
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/",
  }),
  socialAuth
);

//Google auth route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  socialAuth
);

//Github auth route
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: false }),
  socialAuth
);

//twitter auth route
app.get(
  "/auth/twitter",
  passport.authenticate("twitter", { scope: ["profile"] })
);

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/", session: true }),
  socialAuth
);

///////////////////////
///////////////////////
///////////////////////////

server.applyMiddleware({ app, path: "/" });


connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Graphql running on", server.graphqlPath, "on port", PORT);
    });
  })
  .catch((error) => console.log(error));
