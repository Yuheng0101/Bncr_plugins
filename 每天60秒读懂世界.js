/**
 * @author Yuheng | onz3v
 * @name 每天60秒读懂世界
 * @origin onz3v
 * @version 1.0.0
 * @description  每天60秒读懂世界
 * @rule ^(60s|每日60)$
 * @admin false
 * @public true
 * @priority 999
 * @disable false
 */

const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://www.zhihu.com',
    timeout: 1000 * 10,
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    }
})
module.exports = async (s) => {
    get('/api/v4/columns/c_1261258401923026944/items').then(async res => {
        const { data } = res;
        const newItem = data[0];
        const { title, content } = newItem;
        const date = /\d{1,2}月\d{1,2}日/.exec(title)[0];
        const now = new Date();
        const nowStr = `${now.getMonth() + 1}月${now.getDate()}日`;
        if (date !== nowStr) s.reply('今日还未读懂世界')
        let contentArr = content.replace(/\"/g, "'").replace(/<p.*?>/g, '<br>').replace(/<\/p>/g, '').split('<br>').filter(Boolean);
        contentArr.pop();
        const thumb = contentArr[0].match(/data-original='(.*?)'/)[1];
        const subTitle = contentArr.slice(1, 3).join('\n');
        const mainCon = contentArr.slice(3).map(item => item.split('<')[0]).join('\n');
        const text = subTitle + mainCon;
        await s.reply({
            type: 'image',
            msg: text,
            path: thumb
        })
        !['tgBot', 'HumanTG'].includes(s.getFrom()) && await s.reply(text)
    }).catch(err =>
        console.log(err)
    )
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