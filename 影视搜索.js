/**
 * @author Yuheng | onz3v
 * @name 影视搜索
 * @origin onz3v
 * @version 1.0.0
 * @description 影视搜索,好不容易正经一次。
 * @rule ^(电影|电视剧)([\s\S]+)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */

const comFn = require('./lib/functions')
const domain = `https://www.taopianzy.com/`
module.exports = async s => {

    let movie_name = s.param(2)
    let en_movie_name = encodeURIComponent(s.param(2).trim())
    start()

    function start() {
        getList(`${domain}home/search/si1_&ky${en_movie_name}.html`).then((data) => {
            let { title, path } = data;
            getMovieDetail(path).then(async (list) => {
                let replyText = `复制链接直接在https://m3u8-player.com/打开即可\n`
                await list.map(item => replyText += `${item.title}：${item.href}\n`)
                s.reply(replyText)
            }).catch(err => s.reply(err))
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
                    let posMovie = resultData.find(item => item.title === movie_name)
                    if (posMovie) {
                        resolve(posMovie)
                    } else {
                        reject('未找到相关资源')
                    }
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
                    resolve(resultList)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};
