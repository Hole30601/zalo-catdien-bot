const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("../config");

async function getLichCatDien() {

    const { data } = await axios.get(URL);

    const $ = cheerio.load(data);

    console.log("TABLE:", $("table").length);

    console.log("TR:", $("tr").length);

    $("h2,h3,h4").each((i,e)=>{
        console.log($(e).text().trim());
    });

    return [];
}



module.exports = getLichCatDien;
