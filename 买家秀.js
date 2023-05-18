/**
 * @author Yuheng | onz3v
 * @name 买家秀
 * @origin onz3v
 * @version 1.0.0
 * @description 资源均来源 qipamaijia.com
 * @rule ^(mjx|买家秀)$
 * @admin true
 * @public true
 * @priority 999
 * @disable false
 */

const axios = require("axios");
const cheerio = require("cheerio");
module.exports = async s => {
    const baseURL = "http://m.qipamaijia.com";
    const TYPELIST = [
        { path: '/index', name: '最新', total: 580 },
        { path: '/Hot', name: '热门', total: 580 },
        { path: '/Fuli', name: '福利', total: 316 },
        { path: '/Qipa', name: '奇葩', total: 259 },
    ]
    // 可以自定义类型
    const type = TYPELIST.find(item => item.name == '热门');
    const { total, path, name } = type;
    console.log(`当前类型：${name}`)
    const r = Math.floor(Math.random() * total);
    const request = axios.create({
        baseURL,
        timeout: 1000 * 60,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36"
        }
    });
    request.get(`${path}/${r}`)
        .then(res => {
            const $ = cheerio.load(res.data);
            const list = $(".tiezi").map((_, item) => {
                return {
                    title: $(item).find('img').attr('alt'),
                    url: baseURL + $(item).find('img').attr('src'),
                }
            }).get().filter(Boolean);
            const idx = Math.floor(Math.random() * list.length);
            const { title, url } = list[idx];
            s.reply({
                type: "image",
                msg: title,
                path: url
            })
            !['tgBot', 'HumanTG'].includes(s.getFrom()) && s.reply(title);
        }).catch(err => {
            s.reply(err)
        });
}