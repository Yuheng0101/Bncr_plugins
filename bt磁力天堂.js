/**
 * @author Yuheng | onz3v
 * @name bt磁力天堂
 * @origin onz3v
 * @version 1.0.0
 * @description  磁力搜索 个人感觉体验一般，尝鲜，凑合用用吧
 * @rule ^(bt|磁力)([\s\S]+)$
 * @admin false
 * @public false
 * @priority 0
 * @disable false
 */

module.exports = async s => {
    sysMethod.testModule(['cheerio'], { install: true });
    const comFn = require('./lib/functions')
    const cheerio = require('cheerio')
    const domain = `https://691018.xyz`
    const getVarType = (o) => (Object.prototype.toString.call(o).match(/\[object (.*?)\]/) || [])[1].toLowerCase();

    let page = 1
    let kw = s.param(2)
    let en_kw = encodeURIComponent(s.param(2).trim())
    start();
    function start() {
        search().then(async (data) => {
            const { totalPage, list } = data
            let replyText = `你要搜索的内容是 ${kw}\n共找到${totalPage}页数据，当前第${page}页\n`
            await list.map((item) => {
                replyText += `${item.title}\t类型：${item.detail.type}\t大小：${item.detail.size}\t热度：${item.detail.heat}\n磁链地址：${item.detail.magnet}\n\n`
            })
            replyText += `输入n/N下一页，输入p/P上一页，输入q/Q退出\n`
            s.reply(replyText)
            let pgMsg = await s.waitInput(async (sender) => {
                let content = s.getMsg().toLowerCase();
                if (content == 'q') { }
                if (content == 'n') { }
                if (content == 'p') { }
                else {
                    let num = +content;
                    if (getVarType(num) !== 'number') return await sender.reply('输入序号，你输了个啥啊？重输重输')
                    if (num < 0 || num > totalPage) return await sender.reply('最大只有' + totalPage + '页，你输了个啥啊？重输重输')
                }

            }, 60);
            if (pgMsg.getMsg().toLowerCase() === 'q') return s.reply('已退出');
            if (pgMsg.getMsg().toLowerCase() === 'n') {
                if (page === totalPage) return s.reply('已经是最后一页了')
                page++
                start()
            }
            if (pgMsg.getMsg().toLowerCase() === 'p') {
                if (page === 1) return s.reply('已经是第一页了')
                page--
                start()
            }
            if (pgMsg === null) return s.reply('超时退出');
        })
    }
    function search() {
        let url = `${domain}/main-search-kw-${en_kw}-${page}.html`
        return new Promise((resolve, reject) => {
            comFn.requestPromise(url).then(resp => {
                const $ = cheerio.load(resp)
                const totalPage = $('.bottom-pager a').get()
                const list = $('.search-item').map((_, item) => {
                    const aTag = $(item).find('.item-title h3 a')
                    const title = aTag.attr('title')
                    const href = aTag.attr('href')
                    const detail = $(item).find('.item-bar')
                    const type = $(detail).find('.fileType1').text()
                    const createTime = $(detail).find('span').eq(1).find('b').text()
                    const size = $(detail).find('.yellow-pill').text()
                    const heat = $(detail).find('span').eq(3).find('b').text()
                    const magnet = $(detail).find('span').eq(4).find('a').attr('href')
                    return {
                        title,
                        detail: {
                            type,
                            createTime,
                            size,
                            heat,
                            magnet
                        }
                    }
                }).get()
                console.log(totalPage.length)
                resolve({
                    totalPage: totalPage.length,
                    list
                })
            }).catch(err => { reject(err) })
        })
    }
}
