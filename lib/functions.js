const request = require('request')
const Axios = require('axios')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')
const HDQ_UA = require('./USER_AGENTS') // 这里借助红灯区USER_AGENTS.js
const headers = {
    'User-Agent': HDQ_UA.USER_AGENT('Browser')
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

// 仅用作get吧
function _request(options) {
    if (!options?.url) throw new Error('url is required')
    return new Promise((resolve, reject) => {
        request({
            url: options.url,
            method: options?.method || 'GET',
            // data: options?.data || {},
            body: options?.body || '',
            headers: options?.headers || {},
            responseType: options?.responseType || "",
            timeout: options?.timeout || 15000,
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}
function _post(options, isJson = true) {
    const { url, data } = options
    if (!url) throw new Error('url is required')
    let option = { url, method: 'post' }
    if (isJson) {
        option = { ...option, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
    } else {
        option = { ...option, form: data }
    }
    option.headers = { ...option.headers, ...headers }
    return new Promise((resolve, reject) => {
        request(option, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}
const getVarType = (o) => (Object.prototype.toString.call(o).match(/\[object (.*?)\]/) || [])[1].toLowerCase();

function bingImage() {
    return new Promise(async (resolve, reject) => {
        const bing_base = 'https://cn.bing.com';
        const URL = `${bing_base}/HPImageArchive.aspx?format=js&idx=0&n=1`;
        try {
            const resp = await _request({ url: URL })
            const { images } = JSON.parse(resp);
            resolve(bing_base + images[0].url);
        } catch (e) {
            reject(e)
        }
    })
};

module.exports = {
    sleep,
    downloadFile,
    requestPromise,
    _request,
    getVarType,
    bingImage,
    _post
}