const { createWriteStream } = require("fs");
const http = require("http");
const { resolve } = require("path");

const IS_MAIN = __filename.startsWith(process.argv[1]);

(async () => {
    if (IS_MAIN) {
        let urlInput = process.argv[2];
        let urlCleaned = urlInput.startsWith("http") ? urlInput : "https://" + urlInput;
        let url = new URL(urlCleaned);
        let file = resolve(process.cwd(), process.argv[3]);

        console.log(url, file);

        await downloadUrlScreenshot(url.toString(), file);
    }
})();

module.exports = downloadUrlScreenshot;

function downloadUrlScreenshot(url, saveTo) {
    const downloadUrl = `http://image.thum.io/get/width/800/height/450/png/${url}`;
    
    if(IS_MAIN) console.log("Downloading from " + downloadUrl)
    
    return new Promise((resolve, reject) => {
        const saveStream = createWriteStream(saveTo);
        http.request(downloadUrl, (res) => {
            res.on("error", reject);
            if (res.statusCode != 200) return reject(res.statusCode);

            res.on("data", data => saveStream.write(data));

            res.on("close", () => {
                saveStream.end();
                resolve();
            });
        });
    })
}