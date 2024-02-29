require("dotenv").config();
const { LocalStorage } = require("node-localstorage");
const { remove, start, openWebKeyboard } = require("../markups/markups");
const functions = require("../functions/function");
const Order = require("../schemas/order.schema");
const Driver = require("../schemas/driver.schema");
const localStorage = new LocalStorage("./scratch");
const imageUrl =
  "https://codecapsules.io/wp-content/uploads/2023/07/how-to-create-and-host-a-telegram-bot-on-code-capsules-768x768.png";

const handleMessage = async (bot, msg) => {
  const chatId = msg.chat.id;
  const telefonRegex = /^998(?:73|90|91|93|94|95|97|98|99)[1-9]\d{6}$/;
  //   const step = localStorage.getItem("step") || "start";
  try {
    if (msg.text && msg.text == "/start") {
      try {
        const res = await Driver.findOne({ chatId: chatId });
        if (res) {
          const driverId = res._id.toString();
          if (res.carNumber && !res.shift) {
            await functions.sendStartShiftMessage(
              bot,
              chatId,
              res.userName,
              driverId
            );
          } else if (res.carNumber && res.shift) {
            await functions.sendStopShiftMessage(bot, chatId, driverId);
          } else if (res.length <= 0) {
            await functions.sendStopShiftMessage(bot, chatId, driverId);
          }
        }
      } catch (error) {
        console.error("Error handling /start command:", error);
      }
    } else if (
      msg.text &&
      msg.text == "/start@tashkent_fergana_dispatcher_bot"
    ) {
      try {
        await bot.sendMessage(chatId, "Assalomu alaykum", openWebKeyboard);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("botga message keldi", msg);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleMessage,
};
