export let users;
export let open;
export let closed;
export let discussions;

export const injectDB = async (conn) => {
  if (users) {
    return;
  }
  try {
    const promises = [
      conn.db(process.env.KROWDEE_DB).collection("users"),
      conn.db(process.env.KROWDEE_DB).collection("open"),
      conn.db(process.env.KROWDEE_DB).collection("closed"),
      conn.db(process.env.KROWDEE_DB).collection("discussions"),
    ];

    Promise.all(promises).then((data) => {
      users = data[0];
      open = data[1];
      closed = data[2];
      discussions = data[3];
    });

  } catch (e) {
    console.error(e);
  }
};
