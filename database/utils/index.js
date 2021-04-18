import MongoClient from "mongodb";
import { injectDB } from "./injector.js";


export const connection = async () => {
  try {
    const connection = await MongoClient.connect(process.env.KROWDEE_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    injectDB(connection);

  } catch (error) {
   
    throw error;
  }
};
