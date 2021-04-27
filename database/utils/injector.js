export let users;
export let hosted;
export let records;
export let chats;

export const injectDB = async (conn) => {
  if (users) {
    return;
  }
  try {
    const promises = [
      conn.db(process.env.KROWDEE_DB).collection("users"),
      conn.db(process.env.KROWDEE_DB).collection("hosted"),
      conn.db(process.env.KROWDEE_DB).collection("records"),
      conn.db(process.env.KROWDEE_DB).collection("chats"),
    ];

    Promise.all(promises).then((data) => {
      users = data[0];
      hosted = data[1];
      records = data[2];
      chats = data[3];
    });

    hosted = results;
  } catch (e) {
    console.error(e);
  }
};
