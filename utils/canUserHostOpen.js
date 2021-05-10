//RANKS WITH POINTS
const novice = 0;
const amateur = 150;
const senior = 400;
const enthusaist = 700;
const professional = 1500;
const expert = 2000;
const leader = 3500;
const veteran = 6000;
const master = 10000;
const knight = 20000;
const marshal = 30000;

const canUserHostOpen = (pts, hosted) => {
  //WE ARE TO CHECK FOR HOW MANY GLOBAL CONTEST HAVE BEEN HOSTED SINCE THE PREVIOUS MONDAY
  let result = {
    status: true,
  };
  //CHECK FOR THE LAST MONDAY'S DATE
  const getPreviousMonday = (date = null) => {
    const prevMonday = (date && new Date(date.valueOf())) || new Date();
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
    return prevMonday;
  };

  if (!hosted) {
    return {
      status: true,
    };
  }

  //CHECK HOW MANY WAS HOSTED AFTER THE LAST MONDAY
  const totalRecentlyHosted = hosted.filter(
    (host) => host._id.getTimestamp() > getPreviousMonday()
  ).length;

  //BELOW 1500
  if (pts < professional) {
    result = {
      status: false,
      message: "you must reach the rank of professional to host globally",
    };
  }
  //BETWEEN 1500 & 2000
  if (pts >= professional && pts < expert) {
    if (totalRecentlyHosted >= 1) {
      result = {
        status: false,
        message: "you already hosted once this week",
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //BETWEEN 2000 & 3500
  if (pts >= expert && pts < leader) {
    if (totalRecentlyHosted >= 2) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //BETWEEN 3500 & 6000
  if (pts >= leader && pts < veteran) {
    if (totalRecentlyHosted >= 3) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //BETWEEN 6000 & 10,000
  if (pts >= veteran && pts < master) {
    if (totalRecentlyHosted >= 4) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //BETWEEN 10000 & 20000
  if (pts >= master && pts < knight) {
    if (totalRecentlyHosted >= 5) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //BETWEEN 20000 & 30000
  if (pts >= knight && pts < marshal) {
    if (totalRecentlyHosted >= 6) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  //ABOVE 30000
  if (pts >= marshal) {
    if (totalRecentlyHosted >= 7) {
      result = {
        status: false,
        message: `you already hosted ${totalRecentlyHosted} contests this week`,
      };
    } else {
      result = {
        status: true,
      };
    }
  }
  return result;
};


export default canUserHostOpen;