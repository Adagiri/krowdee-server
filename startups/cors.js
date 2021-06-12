import cors from "cors";

var corsOptions = {
  origin: process.env.CLIENT_URL,
  "Access-Control-Allow-Credentials": process.env.CLIENT_URL,
  "Access-Control-Allow-Origin": process.env.CLIENT_URL,
  credentials: true, // <-- REQUIRED backend setting
};

export default (app) => app.use(cors(corsOptions));
