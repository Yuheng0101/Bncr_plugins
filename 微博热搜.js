/**
 * @author Yuheng | onz3v
 * @name 微博热搜
 * @origin onz3v
 * @version 1.0.0
 * @description  微博热搜榜
 * @rule ^(wb|微博)$
 * @admin false
 * @public false
 * @priority 999
 * @disable false
 */
/**
 * 配置返回数量，默认50条全部返回
 */
const pageSize = 50;
const request = require('request');
module.exports = async s => {

    const url = 'https://weibo.com/ajax/statuses/hot_band'
    const headers = {
        'Host': 'weibo.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': 'https://weibo.com/?category=1760',
        'Cookie': 'SRF-TOKEN=gy-JCKoaCdJaydGgNdGOogST; SUB=_2AkMU9HZyf8NxqwFRmP8XxW7qbY1xww_EieKiqIepJRMxHRl-yT9jqkkDtRB6P3RYnazWoKVAc1j0D2MFZq7dbfgCR7Di; UPSTREAM-V-WEIBO-COM=b09171a17b2b5a470c42e2f713edace0; _s_tentry=www.baidu.com; UOR=www.baidu.com,weibo.com,www.baidu.com; Apache=5141979382819.02.1672025150365; SINAGLOBAL=5141979382819.02.1672025150365; ULV=1672025150482:1:1:1:5141979382819.02.1672025150365:; WBPSESS=dg5zs_KFY81p0FnDKmb34RZVNfWqA4WfanF-eevXRNWdIWtd_kUo1q0Ch7GDzlXpHmvQmi-7BWumVFwxBD1iFRNvgEHYg72tSysad_QtTnFbyJJcw7fgyg68oRbFW1Q2oIzltdkpP0sCHaUZEFtU_fMQvLT71kRQDZfIfEjSY1Y=; PPA_CI=01ab9f68a4bb63b1ffbb251ade53b255',
    }
    const options = { url, headers }

    !(async () => {
        const { data: { band_list } } = await fetch(options)
        let replyText = ''
        band_list.map((item, index) => {
            if (index > pageSize) return
            replyText += `【${+item.rank + 1}】${item.note}\n`
        })
        s.reply(replyText)
    })();

    function fetch(options) {
        return new Promise((resolve, reject) => {
            request.get(options, (err, res, body) => {
                if (err) reject(err)
                resolve(JSON.parse(body))
            })
        })
    }
}
