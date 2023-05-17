/**
 * @author Yuheng | onz3v
 * @name 抖音小姐姐
 * @origin onz3v
 * @version 1.0.1
 * @description 正规军
 * @rule ^(小姐姐|xjj)$
 * @admin true
 * @public true
 * @priority 999
 * @disable false
 */
module.exports = async s => {
    const axios = require('axios');
    const instance = axios.create({
        timeout: 100000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/ 5.0(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari / 537.36'
        }
    });
    const getVideoId = async () => {
        const res = await get('https://gitee.com/au_2023/codes/nxe5yoirc9l8s70dzvawh50/raw?blob_name=JoyfulList');
        const random = Math.floor(Math.random() * res.length);
        return res[random];
    }
    const getVideo = async () => {
        const id = await getVideoId();
        const playUrl = await getRedirect(`https://aweme.snssdk.com/aweme/v1/play/?video_id=${id}`);
        s.reply({
            type: 'video',
            msg: '',
            path: playUrl
        })
    }
    getVideo();
    function getRedirect(url) {
        return new Promise((resolve, reject) => {
            instance.get(url, { maxRedirects: 0 }).catch(err => {
                const statusCode = err.response.status;
                if (statusCode == 302) {
                    resolve(err.response.headers.location)
                } else {
                    reject(err)
                }
            })
        })
    }
    function get(url) {
        return new Promise((resolve, reject) => {
            instance.get(url).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}