const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("../config");

async function getLichCatDien() {

    const { data } = await axios.get(URL);

    const $ = cheerio.load(data);

    let rows = [];

    $("table tr").each((i, el) => {

        const cols = $(el)
            .find("td")
            .map((_, td) => $(td).text().trim())
            .get();

        if (cols.length > 0) {
            rows.push(cols.join(" | "));
        }
    });

    return rows;
}

module.exports = getLichCatDien;
