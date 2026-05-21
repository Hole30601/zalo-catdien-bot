const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("../config");

async function getLichCatDien() {

    const { data } =
        await axios.get(URL);

    const $ = cheerio.load(data);

    const rows = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    $(".power-outage-item").each((i, el) => {

        const dateText =
            $(el)
                .find(".outage-date")
                .text()
                .trim();

        const time =
            $(el)
                .find(".outage-time")
                .text()
                .trim();

        const area =
            $(el)
                .find(".outage-area")
                .text()
                .replace("Khu vực:", "")
                .trim();

        const reason =
            $(el)
                .find(".outage-reason")
                .text()
                .replace("Lý do:", "")
                .trim();

        // Chỉ lấy các mục liên quan đến xã Đông Cứu
        const areaLower =
            area.toLowerCase();

        if (
            !areaLower.includes("đông cứu") &&
            !areaLower.includes("dong cuu")
        ) {
            return;
        }

        
        

        const match =
            dateText.match(
                /(\d{2})\/(\d{2})\/(\d{4})/
            );

        if (!match) return;

        const d = Number(match[1]);
const m = Number(match[2]);
const y = Number(match[3]);

const rowDate =
    new Date(y, m - 1, d);

rowDate.setHours(
    0, 0, 0, 0
);

        
const nowVN = new Date(
    new Date().toLocaleString(
        "en-US",
        { timeZone: "Asia/Ho_Chi_Minh" }
    )
);

nowVN.setHours(0, 0, 0, 0);

const diffDays = Math.floor(
    (rowDate - nowVN) / 86400000
);

console.log({
    dateText,
    diffDays
});

        if(diffDays !== 1){
            return;
        }
        rows.push(
`📅 ${dateText}
🕒 ${time}
📍 ${area}
🔧 ${reason}

⚠️ Thời gian cắt điện chỉ là kế hoạch dự kiến của đơn vị điện lực. Thực tế có thể cắt sớm hơn, muộn hơn hoặc thay đổi mà không báo trước.`
        );

    });

    return rows;
}

module.exports = getLichCatDien;
