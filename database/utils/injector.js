export let users;
export let open;
export let closed;
export let discussions;
export let notifications;
export let globalNotifications;
export let tasksTemplate;

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
      conn.db(process.env.KROWDEE_DB).collection("notifications"),
      conn.db(process.env.KROWDEE_DB).collection("global_notifications"),
      conn.db(process.env.KROWDEE_DB).collection("tasks_template"),
    ];

    Promise.all(promises).then((data) => {
      users = data[0];
      open = data[1];
      closed = data[2];
      discussions = data[3];
      notifications = data[4];
      globalNotifications = data[5];
      tasksTemplate = data[6];
    });

  } catch (e) {
    console.error(e);
  }
};
