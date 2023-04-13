/**
 * @author Yuheng | onz3v
 * @name 插件汇总
 * @origin onz3v
 * @version 1.0.0
 * @description 汇总一下常用脚本，根据需求自己增删
 * @rule ^(彩虹屁|微博热搜榜|新闻热榜|网易云热评|历史上的今天|笑话|壁纸|每日一图|每日一言|诗词|舔狗日记|汇总菜单)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
*/
module.exports = async s => {
    const comFn = require('./lib/functions')
    const input = s.getMsg();
    if (input == "汇总菜单") {
        var n = ``;
        n += "----------汇总菜单----------\n";
        var g = ['彩虹屁', '微博热搜榜', '新闻热榜', '网易云热评', '历史上的今天', '笑话', '壁纸', '每日一图', '每日一言', '诗词',
            '舔狗日记'];
        g.map((item) => { n += item + "\n" });
        n += `------------------------------`;
        s.reply(n)
    } else {
        s.reply('正在查询中，请稍后...')
        totalClass();
    }
    function sendImage(url) {
        s.reply({ type: 'image', path: url })
    }
    async function totalClass() {
        switch (input) {
            case '彩虹屁':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/chp.php' }));
                break;
            case '微博热搜榜':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/wb.php' }));
                break;
            case '新闻热榜':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/xw.php' }));
                break;
            case '网易云热评':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/wyrp.php' }));
                break;
            case '历史上的今天':
                s.reply(await comFn._request({ url: "http://xiaobai.klizi.cn/API/other/ls.php" }));
                break;
            case '笑话':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/sjxh.php' }));
                break;
            case '诗词':
                const resp = await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/sjsc.php' });
                const { content, origin, author } = JSON.parse(resp);
                const replyText = `\t《${origin}》\n\t\t\t\t${author}\n${content}`;
                s.reply(replyText);
                break;
            case '每日一言':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/yy.php' }));
                break;
            case '壁纸':
                sendImage(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/img/sjbz.php' }));
                break;
            case '舔狗日记':
                s.reply(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/tgrj.php' }));
                break;
            case '每日一图':
                sendImage(await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/bing.php' }))
                break;
        }
    }
};