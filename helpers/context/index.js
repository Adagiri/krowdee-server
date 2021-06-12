import jwt from "jsonwebtoken";
import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

function getCookie(cookies, name) {
  var cookieArr = cookies.split(";");

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

export const getUser = async (req) => {
  try {
    req.userId = null;

    let cookies = req.headers.cookie;
    if (!cookies) return;
    const token = getCookie(cookies, "krowdeetoken");
    if (!token) return;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload.userId) {
        req.userId = payload.userId;
      }
    }
  } catch (error) {
    throw new Error("failed to verify session");
  }
};
