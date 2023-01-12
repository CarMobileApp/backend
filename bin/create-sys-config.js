const mongoose = require("mongoose");
const config = require("../config");

mongoose.connect(config.MONGO_URL).then(async () => {
  const db = mongoose.connection;
  let data = [
    {
      day: 0,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 1,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 2,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 3,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 4,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 5,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: false,
      isActive: true,
    },
    {
      day: 6,
      slotTime: {
        hour: 1,
        minute: 0,
      },
      startTime: {
        hour: 8,
        minute: 0,
      },
      endTime: {
        hour: 18,
        minute: 0,
      },
      breakStartTime: {
        hour: 13,
        minute: 0,
      },
      breakEndTime: {
        hour: 14,
        minute: 0,
      },
      holiday: true,
      isActive: true,
    },
  ];
  db.collection("systems").insertMany(data, (error) => {
    if (error) {
      console.log(error);
    }
    db.close();
  });
});
