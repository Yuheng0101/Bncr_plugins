/**
 * @author Yuheng | onz3v
 * @name 影视搜索
 * @origin onz3v
 * @version 1.0.0
 * @description 影视搜索,好不容易正经一次。
 * @rule ^(电影|电视剧|动漫)([\s\S]+)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */

module.exports = async s => {
    const comFn = require('./lib/functions')
    const domain = `https://www.taopianzy.com/`
    const getVarType = (o) => (Object.prototype.toString.call(o).match(/\[object (.*?)\]/) || [])[1].toLowerCase();
    let movie_name = s.param(2)
    let en_movie_name = encodeURIComponent(s.param(2).trim())
    start()

    function start() {
        getList(`${domain}home/search/si1_&ky${en_movie_name}.html`).then(async (data) => {
            let replyText = `找到以下资源，请按序号选择：\n如果没有想要的资源输入q/Q退出\n`
            await data.map((item, index) => replyText += `${index + 1}、${item.title}\n`)
            let replyId = await s.reply(replyText)
            let idxMsg = await s.waitInput(async (sender) => {
                let content = s.getMsg();
                if (content == 'q') { }
                else {
                    let num = +content;
                    if (getVarType(num) !== 'number') return await sender.reply('输入序号，你输了个啥啊？重输重输')
                    if (num < 0 || num > data.length) return await sender.reply('？？？序号有这个么？重输重输')
                }

            }, 60);
            if (idxMsg.getMsg().toLowerCase() === 'q') return s.reply('已退出');
            if (idxMsg === null) return s.reply('超时退出');
            else {
                const index = +idxMsg.getMsg();
                const item = data[index - 1];
                let { title, path } = item;
                getMovieDetail(path)
                    .then(async (list) => {
                        let replyText = `复制链接直接在https://m3u8-player.com/打开即可\n`
                        await list.map(item => replyText += `${item.title}：${item.href}\n`)
                        console.log(replyText)
                        s.reply(replyText)
                    })
                    .catch(err => s.reply(err))
                    .finally(async () => {
                        await sysMethod.sleep(2);
                        s.delMsg(idxMsg.getMsgId())
                        s.delMsg(replyId)
                    })
            }
        }).catch(err => s.reply(err))
    }
    function getList(url) {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(url)
                .then(resp => {
                    const _html = resp.replace(/\n|\s|\r/g, '')
                    const list = _html.match(/<tdclass=\"fontlefttxleft\">(\S*?)<\/td>/g)
                    let resultData = []
                    list.map((item) => {
                        let aTag = item.match(/<a(\S*?)<\/a>/g)[0]
                        let href = aTag.match(/href=\"(\S*?)\"/)[1]
                        let title = aTag.match(/>(\S*?)</)[1]
                        resultData.push({ title, path: href })
                    })
                    resolve(resultData)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    function getMovieDetail(path) {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(`${domain}${path}`)
                .then(resp => {
                    const _html = resp.replace(/\n|\s|\r/g, '')
                    let _table = _html.match(/<tableclass=\"tabletable-borderedaddrs\">(\S*?)<\/table>/)[0]
                    let _tbody = _table.match(/<tbody>(\S*?)<\/tbody>/)[0]
                    let _trs = _tbody.match(/<tr>(\S*?)<\/tr>/g).filter(tr => !tr.includes('display: none;'))
                    let resultList = []
                    if (_trs.length > 50) {
                        reject(`资源过多，无法显示，播放地址：${domain}${path}`)
                    } else {
                        _trs.map(tr => {
                            try {
                                if (tr) {
                                    let title = tr.match(/<spanclass=\"download-title\"class=\"btns\">(\S*?)<\/span>/)[1]
                                    let tbAddrs = tr.match(/<divclass=\"tbAddr\">(\S*?)<\/div>/)[1]
                                    let href = tbAddrs.match(/value=\"(\S*?)\"/)[1]
                                    resultList.push({ title, href })
                                }
                            } catch (e) {
                                reject(e)
                            }
                        })
                    }
                    resolve(resultList)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};
