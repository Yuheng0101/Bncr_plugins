/**
 * @author Yuheng | onz3v
 * @name jav-gallery
 * @origin onz3v
 * @version 1.0.0
 * @description 一次使用cheerio对学习资料的爬虫尝试 18+ 请勿滥用
 * @rule ^(h图)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */
const comFn = require('./lib/functions')
const cheerio = require('cheerio')
const page = Math.floor(Math.random() * 999)
const domain = 'https://jav.gallery'

module.exports = async s => {
    start();
    function start() {
        getList().then(async list => {
            const random = Math.floor(Math.random() * list.length)
            const item = list[random]
            const { title, link: href } = item
            console.log(`当前标题：${title}`)
            getDetail(href).then(data => {
                const subList = data.filter(Boolean)
                s.reply(`${title}: ${data.length}张`)
                subList.map(imgUrl => s.reply({ type: 'image', path: imgUrl }))
            })
        })
    }


    function getList() {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(`${domain}/${page}`).then(html => {
                const $ = cheerio.load(html)
                const list = $('.related a').map((_, item) => {
                    const href = $(item).attr('href')
                    if (!href) return
                    if (href.indexOf('//') > -1) return
                    const title = $(item).text()
                    return { title, link: domain + href }
                }).get()
                resolve(list);
            })
        })
    }
    function getDetail(url) {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(url).then(html => {
                const $ = cheerio.load(html)
                const list = $('#macy a').map((_, item) => {
                    const src = $(item).attr('href')
                    return domain + src
                }).get()
                resolve(list);
            })
        })

    }
}
