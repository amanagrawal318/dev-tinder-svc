const cron = require("node-cron");
const ConnectionRequest = require("../Models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendAWSEmail = require("./sendAWSEmail");

// use crontab guru for cron syntax
cron.schedule("32 18 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStartTime = startOfDay(yesterday);
    const yesterdayEndTime = endOfDay(yesterday);
    const connectionRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStartTime,
        $lt: yesterdayEndTime,
      },
    }).populate("fromUserId toUserId");

    if (connectionRequest.length === 0) {
      throw new Error("No connection requests found for yesterday");
    }

    const EmailList = [
      ...new Set(connectionRequest.map((req) => req.toUserId.email)),
    ];

    EmailList.forEach(async (email) => {
      const mailRes = await sendAWSEmail.run(
        "Reminder: Connection Requests",
        "You have pending connection requests from yesterday for " + email
      );
    });
  } catch (error) {
    console.log("Error running cron job: ", error.message);
  }
});
