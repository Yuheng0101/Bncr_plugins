/**
 * @author Yuheng | onz3v
 * @name 115色图
 * @origin onz3v
 * @version 1.0.0
 * @description 一次不使用cheerio对学习资料的爬虫尝试 18+ 请勿滥用
 * @rule ^(mm|色图)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */

const comFn = require('./lib/functions')
const domain = `http://155zy.com/`
const typeList = [
    { title: '街拍偷拍', id: 25, maxPage: 29 },
    { title: '丝袜美腿', id: 26, maxPage: 27 },
    { title: '欧美风情', id: 27, maxPage: 26 },
    { title: '网友自拍', id: 28, maxPage: 31 },
    { title: '卡通漫画', id: 29, maxPage: 21 },
    { title: '露出激情', id: 30, maxPage: 32 },
    { title: '唯美写真', id: 31, maxPage: 29 },
    { title: '女优情报', id: 32, maxPage: 31 },
]
// 自个改吧
const curTypeMap = typeList.map(item => item == '丝袜美腿')
const page = Math.floor(Math.random() * curTypeMap.maxPage)
module.exports = async s => {
    start()
    function start() {
        getList().then((data) => {
            getImg(data.path).then((imgList) => {
                const { title } = data;
                s.reply(title)
                imgList.map(imgUrl => s.reply({ type: 'image', path: imgUrl }))

            })
        })
    }
    function getList() {
        let url = `${domain}index.php/art/type/id/26/page/${page}.html`
        return new Promise((resolve, reject) => {
            comFn.requestPromise(url)
                .then(resp => {
                    const _html = resp.replace(/\n|\s|\r/g, '')
                    const _body = _html.match(/<ulclass=\"videoContent\">(\S*?)<\/ul>/g)[0]
                    const list = _body.match(/<li>(\S*?)<\/li>/g)
                    // 可以爬取 使用map + fs + path 下载套图到本地，可以参考红灯区的举牌插件，我这边就不加了
                    // list.map((item, index) => {
                    const randomIdx = Math.floor(Math.random() * list.length)
                    const item = list[randomIdx]
                    if (item.indexOf('class=\"videoName\"') !== -1) {
                        let aTag = item.match(/<a(\S*?)<\/a>/g)[0]
                        aTag = aTag.replace(/<img(\S*?)>/g, '')
                        const title = aTag.match(/>(\S*?)</)[1]
                        const path = item.match(/href=\"(\S*?)\"/)[1]
                        resolve({ title, path, imgList: [] })
                    }
                    // })
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    function getImg(path) {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(`${domain}/${path}`)
                .then(resp => {
                    const _html = resp.replace(/\n|\s|\r/g, '')
                    const _body = _html.match(/<divclass=\"f14\"id=\"read_tpc\">(\S*?)<\/div>/g)[0]
                    let list = _body.match(/<img(\S*?)>/g)
                    let imgs = list.map(item => item.match(/src=\"(\S*?)\"/)[1])
                    resolve(imgs)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

};

