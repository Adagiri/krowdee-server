import MongoClient from "mongodb";

export let db;

export default async () => {
  MongoClient.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(async (data) => {

      db = data.db("krowdee_prime");
      
    })
    .catch((error) => {
      throw error;
    });
};
