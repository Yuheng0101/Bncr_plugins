/**
 * @author Yuheng | onz3v
 * @name 155色图
 * @origin onz3v
 * @version 1.0.0
 * @description 一次不使用cheerio对学习资料的爬虫尝试 18+ 请勿滥用
 * @rule ^(mm|色图)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */

module.exports = async s => {
    const comFn = require('./lib/functions')
    const domain = `http://155zy.com`
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
    // 自定义类型
    const curTypeMap = typeList.find(item => item.title == '丝袜美腿')
    // 自定义分页数量
    const pageNum = 5
    const page = Math.floor(Math.random() * curTypeMap.maxPage)
    const id = curTypeMap.id
    console.log(`当前类型：${curTypeMap.title}，当前页码：${page}`)
    start()
    function start() {
        getList().then((data) => {
            const { path } = data
            getImg(path).then(async (imgList) => {
                const { title } = data;
                s.reply(title)
                let newList = arr2Dyadic(imgList, pageNum)
                let isCancel = false;
                for (let i = 0; i < newList.length; i++) {
                    if (isCancel) {
                        s.reply('已取消')
                        return;
                    }
                    if (i == 0) { await newList[i].map(item => sendImage(item)) }
                    else if (i == newList.length - 1) {
                        await newList[i].map(item => sendImage(item))
                        s.reply(`已加载全部`)
                        return;
                    } if (i > 0 && !isCancel) {
                        s.reply("是否继续返回剩余图片,y/Y继续，其他取消")
                        let input = await s.waitInput(() => { }, 30)
                        if (!input) return s.reply("操作超时或取消，已退出。");
                        let content = input.getMsg();
                        if (content.toLowerCase() !== 'y') {
                            isCancel = true
                            return s.reply('已取消')
                        } else {
                            await newList[i].map(item => sendImage(item))
                        }
                    }
                }
                imgList.map(imgUrl => s.reply({ type: 'image', path: imgUrl }))
            }).catch(err => s.reply(err))
        }).catch(err => s.reply(err))
    }
    function getList() {
        let url = `${domain}/index.php/art/type/id/${id}/page/${page}.html`
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
                        console.log(`当前爬取的标题：${title}`)
                        const path = item.match(/href=\"(\S*?)\"/)[1]
                        resolve({ title, path })
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
            comFn.requestPromise(`${domain}${path}`)
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
    function sendImage(url) {
        s.reply({ type: 'image', path: url })
    }
    /**
     * 数组升维
     * @param {*} arr 原数组
     * @param {*} chunkSize 每个数组的长度
     * @returns 二位数组
     */
    function arr2Dyadic(arr, chunkSize) {
        const newArr = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            newArr.push(chunk);
        }
        return newArr;
    }
};

