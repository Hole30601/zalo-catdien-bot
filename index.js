const express = require("express");
const cron = require("node-cron");
const { BOT_TOKEN, USER_ID } = require("./config");
const getLichCatDien = require("./services/scraper");
const sendMessage = require("./services/zalo");
const setWebhook =
    require("./setWebhook");
const {
  loadData,
  saveData
} = require("./utils/storage");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// GIAO DIỆN GỬI TIN NHẮN
// =========================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>ZApps Bot</title>

<style>
body{
font-family:Arial;
max-width:600px;
margin:40px auto;
padding:20px;
}

textarea{
width:100%;
height:150px;
padding:10px;
}

button{
margin-top:10px;
padding:12px 20px;
cursor:pointer;
}

</style>
</head>

<body>

<h2>Gửi tin nhắn Bot</h2>

<form method="POST" action="/check-now">
<button type="submit">
⚡ Kiểm tra lịch cắt điện ngay
</button>
</form>

<hr>

<form method="POST" action="/send">

<textarea
name="message"
placeholder="Nhập nội dung..."
required></textarea>

<br>

<button type="submit">
Gửi tin nhắn
</button>

</form>

</body>
</html>
`);
});

// =========================
// GỬI TIN NHẮN TỪ WEB
// =========================
app.post("/send", async (req, res) => {

  try {

    const msg = req.body.message;

    await sendMessage(msg);

    res.send(`
      <h3>✅ Đã gửi</h3>
      <a href="/">Quay lại</a>
    `);

  } catch (e) {

    console.error(e);

    res.status(500).send("Lỗi gửi");
  }
});

// =========================
// TEST
// =========================
// =========================
// KIỂM TRA NGAY VÀ GỬI
// =========================
app.post("/check-now", async (req, res) => {

  const current = await getLichCatDien();

  const message =
`⚡ KIỂM TRA THỦ CÔNG

${current.join("\n")}`;

  console.log("CHECK NOW MESSAGE:");
  console.log(message);

  await sendMessage(message);

  res.send("OK");
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
// WEBHOOK BOT ZAPPS
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

    // user gửi tin nhắn
    if (
      event.message &&
      event.message.text
    ) {

      const text =
        event.message.text.trim();

      const userId =
        event.message.chat?.id ||
        event.message.from?.id;

      console.log(
        "USER:",
        userId
      );

      console.log(
        "TEXT:",
        text
      );

      // ====================
      // /start
      // ====================
      if (text === "/start") {

        await sendMessage(
          `👋 Xin chào!

Tôi là bot thông báo lịch cắt điện.

Các lệnh hỗ trợ:

/start
/help

⚡ Bot sẽ gửi thông báo khi phát hiện lịch cắt điện mới.`
        );
      }

      // ====================
      // /help
      // ====================
      if (text === "/help") {

        await sendMessage(
          `Danh sách lệnh:

/start
/help`
        );
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
        item => !old.includes(item)
      );

    if (newItems.length > 0) {

      const message =
`⚡ Có lịch cắt điện mới

${newItems.join("\n")}`;

      await sendMessage(message);

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

// 10 phút/lần
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

  

  console.log(
    `Webhook: /webhook`
  );

});

setWebhook();
