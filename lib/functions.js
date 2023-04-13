const request = require('request')
const Axios = require('axios')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')
const UA = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
]
const headers = {
    'User-Agent': UA[Math.floor(Math.random() * UA.length)]
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFile(imgUrl, filepath, flieName) {
    console.log('downloadFile', imgUrl, filepath, flieName)
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }
    const mypath = path.resolve(filepath, flieName);
    const writer = fs.createWriteStream(mypath); // 创建写入对象
    const response = await Axios({
        url: imgUrl,
        method: "GET",
        responseType: "stream",
        headers
    });
    response.data.pipe(writer); // 写入图片数据到文件中
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

function requestPromise(url, iconvType = 'utf8') {
    return new Promise((resolve, reject) => {
        request(
            url,
            { encoding: null, strictSSL: false, headers },
            (error, res, body) => {
                if (res.statusCode === 200) {
                    const html = iconv.decode(body, iconvType)
                    resolve(html)
                } else {
                    reject(error)
                }
            }
        )
    })
}

module.exports = {
    sleep,
    downloadFile,
    requestPromise
}