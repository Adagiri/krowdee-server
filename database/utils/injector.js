export let users;
export const injectDB = async (conn) => {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.KROWDEE_DB).collection("users");
    } catch (e) {
      console.error(e);
    }
  };