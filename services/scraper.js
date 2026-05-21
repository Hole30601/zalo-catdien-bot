const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("../config");

async function getLichCatDien() {

    const { data } = await axios.get(URL);

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

        rowDate.setHours(0, 0, 0, 0);

        // Chỉ lấy từ ngày mai trở đi
        if (rowDate <= today) return;

        rows.push(
`📅 ${dateText}
🕒 ${time}
📍 ${area}
🔧 ${reason}`
        );

    });

    return rows;
}

module.exports = getLichCatDien;
