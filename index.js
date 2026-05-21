const express = require("express");
const cron = require("node-cron");

const { BOT_TOKEN, USER_ID, ADMIN_ID } =
require("./config");

const getLichCatDien =
require("./services/scraper");

const sendMessage =
require("./services/zalo");

const setWebhook =
require("./setWebhook");

const {
  getSubscribers,
  addSubscriber,
  removeSubscriber
} = require("./utils/subscribers");

const {
  loadData,
  saveData
} = require("./utils/storage");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

let waitingBroadcast = false;

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {

  res.send("Bot đang hoạt động");

});

// =========================
// WEBHOOK INFO
// =========================
app.get("/webhook", (req, res) => {

  res.json({
    success: true,
    message: "Webhook hoạt động"
  });

});

// =========================
// WEBHOOK BOT
// =========================
app.post("/webhook", async (req, res) => {

  try {

    console.log(
      JSON.stringify(
        req.body,
        null,
        2
      )
    );

    const event = req.body;

    if (
      event.message &&
      event.message.text
    ) {

      const text =
        event.message.text.trim();

      const userId =
        String(
          event.message.chat?.id ||
          event.message.from?.id ||
          ""
        );

      console.log(
        "USER:",
        userId
      );

      console.log(
        "TEXT:",
        text
      );

      // =====================
      // ADMIN ĐANG NHẬP THÔNG BÁO
      // =====================
      if (
        waitingBroadcast &&
        userId === String(ADMIN_ID) &&
        !text.startsWith("/")
      ) {

        waitingBroadcast = false;

        await sendMessage(
`📢 THÔNG BÁO

${text}`
        );

        return res.sendStatus(200);

      }

      // =====================
      // START
      // =====================
      if (text === "/start") {

        await sendMessage(
`👋 Xin chào

Tôi là bot thông báo lịch cắt điện.

/help 

Để Biết Thông Tin Các Lệnh`
        );

      }

      // =====================
      // HELP
      // =====================
      else if (
        text === "/help"
      ) {

        await sendMessage(
`Danh sách lệnh

/start
/help
/id

Điện Đóm ⚡️
/kiemtra
Kiểm tra lịch cắt điện hiện tại

Admin
/sendmes
/adduser
/deluser
Gửi thông báo`
        );

      }

      // =====================
      // XEM ID
      // =====================
      else if (
        text === "/id"
      ) {

        await sendMessage(
`ID của bạn:

${userId}`
        );

      }

      // =====================
      // KIỂM TRA THỦ CÔNG
      // =====================
      else if (
        text === "/kiemtra"
      ) {

        const current =
          await getLichCatDien();

        let message =
          "⚡ KIỂM TRA THỦ CÔNG\n\n";

        if (
          !current ||
          current.length === 0
        ) {

          message +=
            "Không có lịch cắt điện.";

        } else {

          message +=
            current.join("\n");

        }

        const users =
  getSubscribers();

for (const id of users) {

  await sendMessage(
    message,
    id
  );

}

      }

        // thêm người nhận
else if (
  text.startsWith("/adduser ")
) {

  if (
    userId !== String(ADMIN_ID)
  ) {

    await sendMessage(
      "❌ Bạn không phải admin."
    );

  } else {

    const targetId =
      text.replace(
        "/adduser ",
        ""
      ).trim();

    addSubscriber(
      targetId
    );

    await sendMessage(
`✅ Đã thêm người nhận:

${targetId}`
    );

  }

}

  // xoá người nhận
else if (
  text.startsWith("/deluser ")
) {

  if (
    userId !== String(ADMIN_ID)
  ) {

    await sendMessage(
      "❌ Bạn không phải admin."
    );

  } else {

    const targetId =
      text.replace(
        "/deluser ",
        ""
      ).trim();

    removeSubscriber(
      targetId
    );

    await sendMessage(
`🗑️ Đã xoá:

${targetId}`
    );

  }

}
  // danh sách người nhận
else if (
  text === "/users"
) {

  if (
    userId !== String(ADMIN_ID)
  ) {

    await sendMessage(
      "❌ Bạn không phải admin."
    );

  } else {

    const users =
      getSubscribers();

    await sendMessage(
`👥 Danh sách người nhận

${users.join("\n") || "Trống"}`
    );

  }

}
  
      // =====================
      // GỬI THÔNG BÁO
      // =====================
      else if (
        text === "/sendmes"
      ) {

        if (
          userId !==
          String(
            ADMIN_ID
          )
        ) {

          await sendMessage(
            "❌ Bạn không phải admin."
          );

        } else {

          waitingBroadcast = true;

          await sendMessage(
`📢 Bạn muốn gửi thông báo nào?

Hãy nhập nội dung tin nhắn tiếp theo.`
          );

        }

      }

    }

    res.sendStatus(200);

  } catch (err) {

    console.error(err);

    res.sendStatus(200);

  }

});

// =========================
// KIỂM TRA LỊCH CẮT ĐIỆN
// =========================
async function checkSchedule() {

  try {

    const current =
      await getLichCatDien();

    const old =
      loadData();

    const newItems =
      current.filter(
        item =>
          !old.includes(item)
      );

    if (
      newItems.length > 0
    ) {

      const message =
`⚡ Có lịch cắt điện mới

${newItems.join("\n")}`;

      const users =
  getSubscribers();

for (const id of users) {

  await sendMessage(
    message,
    id
  );

}
      console.log(
        "Đã gửi thông báo"
      );

      saveData(current);

    } else {

      console.log(
        "Không có thay đổi"
      );

    }

  } catch (err) {

    console.error(
      err.message
    );

  }

}

// chạy ngay
checkSchedule();

// mỗi 10 phút
cron.schedule(
  "*/10 * * * *",
  () => {

    console.log(
      "Đang kiểm tra..."
    );

    checkSchedule();

  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () => {

    console.log(
      `Server chạy tại cổng ${PORT}`
    );

    console.log(
      "Webhook: /webhook"
    );

    setWebhook();

  }
);
