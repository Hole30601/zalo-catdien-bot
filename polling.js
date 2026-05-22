const axios = require("axios");
const { BOT_TOKEN } =
require("./config");

async function startPolling(
  handleMessage
) {

  while (true) {

    try {

      const entrypoint =
`https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/getUpdates`;

      const res =
        await axios.post(
          entrypoint,
          {
            timeout: 30
          }
        );

      if (
        !res.data?.ok ||
        !res.data?.result
      ) {
        continue;
      }

      const event =
        res.data.result;

      if (
        event.event_name !==
        "message.text.received"
      ) {
        continue;
      }

      const text =
        event.message?.text?.trim();

      const userId =
        String(
          event.message?.chat?.id ||
          event.message?.from?.id ||
          ""
        );

      if (
        text &&
        userId
      ) {

        console.log(
          `[${userId}] ${text}`
        );

        await handleMessage(
          userId,
          text
        );

      }

    } catch (err) {

      console.error(
        err.response?.data ||
        err.message
      );

      await new Promise(
        r => setTimeout(r, 5000)
      );

    }

  }

}

module.exports =
  startPolling;
