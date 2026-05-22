const express = require("express");
const cron = require("node-cron");

const { BOT_TOKEN, ADMIN_ID } =
require("./config");

const getLichCatDien =
require("./services/scraper");

const sendMessage =
require("./services/zalo");

const sendMessageToUser =
require("./services/sendMessageToUser");

const sendAllMessage =
require("./services/sendAllMessage");


const startPolling =
require("./polling");

const db = require("./firebase");

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
// ========================




// =========================
// WEBHOOK BOT

async function handleMessage(userId, text) {

  try {

    await db
      .ref("users")
      .child(userId)
      .set({
        userId,
        updatedAt: Date.now()
      });

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

      await sendMessageToUser(
        userId,
        "✅ Đã gửi thông báo tới tất cả người nhận."
      );

      return;
    }

    // =====================
    // START
    // =====================
    if (text === "/start") {

      await sendMessageToUser(
        userId,
`👋 Xin chào

Tôi là bot thông báo lịch cắt điện.

/help
Xem danh sách lệnh

/dangky
Đăng ký nhận thông báo

/huy
Hủy nhận thông báo`
      );

    }

    // =====================
    // HELP
    // =====================
    else if (text === "/help") {

      await sendMessageToUser(
        userId,
`📖 Danh sách lệnh

/start
/help
/id

⚡ Điện Đóm

/kiemtra
Kiểm tra lịch cắt điện hiện tại

/dangky
Đăng ký nhận thông báo

/huy
Hủy nhận thông báo

👑 Admin

/sendmes
/adduser ID
/deluser ID
/users`
      );

    }

    // =====================
    // ID
    // =====================
    else if (text === "/id") {

      await sendMessageToUser(
        userId,
`ID của bạn

${userId}`
      );

    }

    // =====================
    // KIỂM TRA
    // =====================
    else if (text === "/kiemtra") {

      const current =
        await getLichCatDien();

      let message =
        "⚡ LỊCH CẮT ĐIỆN HIỆN TẠI\n\n";

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

      await sendMessageToUser(
        userId,
        message
      );

    }

    // =====================
    // ĐĂNG KÝ
    // =====================
    else if (text === "/dangky") {

      await addSubscriber(userId);

      await sendMessageToUser(
        userId,
        "✅ Đã đăng ký nhận thông báo lịch cắt điện."
      );

    }

    // =====================
    // HỦY
    // =====================
    else if (text === "/huy") {

      await removeSubscriber(userId);

      await sendMessageToUser(
        userId,
        "❌ Đã hủy nhận thông báo."
      );

    }

    // =====================
    // ADD USER
    // =====================
    else if (
      text.startsWith("/adduser ")
    ) {

      if (
        userId !== String(ADMIN_ID)
      ) {

        await sendMessageToUser(
          userId,
          "❌ Bạn không phải admin."
        );

      } else {

        const targetId =
          text.replace(
            "/adduser ",
            ""
          ).trim();

        await addSubscriber(
          targetId
        );

        await sendMessageToUser(
          userId,
`✅ Đã thêm người nhận

${targetId}`
        );

      }

    }

    // =====================
    // DEL USER
    // =====================
    else if (
      text.startsWith("/deluser ")
    ) {

      if (
        userId !== String(ADMIN_ID)
      ) {

        await sendMessageToUser(
          userId,
          "❌ Bạn không phải admin."
        );

      } else {

        const targetId =
          text.replace(
            "/deluser ",
            ""
          ).trim();

        await removeSubscriber(
          targetId
        );

        await sendMessageToUser(
          userId,
`🗑️ Đã xóa

${targetId}`
        );

      }

    }

    // =====================
    // USERS
    // =====================
    else if (text === "/users") {

      if (
        userId !== String(ADMIN_ID)
      ) {

        await sendMessageToUser(
          userId,
          "❌ Bạn không phải admin."
        );

      } else {

        const users =
          await getSubscribers();

        await sendMessageToUser(
          userId,
`👥 Danh sách người nhận

${users.length
  ? users.join("\n")
  : "Trống"}`
        );

      }

    }

    // =====================
    // SEND MESSAGE
    // =====================
    else if (
      text === "/sendmes"
    ) {

      if (
        userId !== String(ADMIN_ID)
      ) {

        await sendMessageToUser(
          userId,
          "❌ Bạn không phải admin."
        );

      } else {

        waitingBroadcast = true;

        await sendMessageToUser(
          userId,
`📢 Hãy nhập nội dung thông báo cần gửi cho tất cả người nhận.`
        );

      }

    }

  } catch (err) {

    console.error(
      "handleMessage:",
      err
    );

  }

}

// =========================
// KIỂM TRA LỊCH CẮT ĐIỆN
// =========================

async function checkSchedule() {

    try {

        const current =
            await getLichCatDien();

        const old =
            await loadData();

        const newItems =
            current.filter(
                item => !old.includes(item)
            );

        if (newItems.length > 0) {

            const message =
`⚡ Có lịch cắt điện mới

${newItems.join("\n")}`;

            await sendAllMessage(message);
            

            console.log(
                "Đã gửi thông báo"
            );

            await saveData(current);

        } else {

            console.log(
                "Không có thay đổi"
            );
        }

    } catch (err) {

        console.error(err);
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

app.listen(PORT, () => {

  console.log(
    `Server chạy tại cổng ${PORT}`
  );

  startPolling(
    handleMessage
  );

});
