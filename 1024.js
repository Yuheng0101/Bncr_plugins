/**
 * @author Yuheng | onz3v
 * @name 1024
 * @origin onz3v
 * @version 1.0.0
 * @description 自行测试 无需多言 18+ 请勿滥用
 * @rule ^1024$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */
const comFn = require('./lib/functions')
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const domain = "https://z227m.com/";
const typeList = [{ "name": "丝袜", "id": "21" }]; // 这里自己选择
// const data = [{ "name": "街拍", "id": "49" },{ "name": "写真", "id": "14" }, { "name": "自拍", "id": "15" }, { "name": "露出", "id": "16" }, { "name": "街拍", "id": "49" }, { "name": "丝袜", "id": "21" }, { "name": "欧美", "id": "114" },];
let id = typeList[random(0, typeList.length - 1)]['id'], pg = random(0, 10), pageNum = 1; // 分页数量
module.exports = async s => {
    start();
    function start() {
        getList().then(path => {
            getDetail(path).then(async list => {
                if (list.length > pageNum) {
                    let newList = arr2Dyadic(list, pageNum)
                    let i = 0;
                    while (1) {
                        if (i == newList.length - 1) {
                            await newList[i].map(item => sendImage(item))
                            return s.reply(`已加载全部`);
                        }
                        async function clearMsg() {
                            s.delMsg(replyId)
                            await s.delMsg(input.getMsgId())
                        }
                        await newList[i].map(item => sendImage(item))
                        let replyId = s.reply("是否继续返回剩余图片,y/Y继续，其他取消")
                        let input = await s.waitInput(() => { }, 30)
                        if (!input) return s.reply("操作超时或取消，已退出。");
                        let content = input.getMsg();
                        if (content.toLowerCase() !== 'y') {
                            await clearMsg();
                            return s.reply(`已取消`);
                        }
                        clearMsg();
                        i++
                    }
                } else {
                    list.map(item => sendImage(item))
                }
            }).catch(err => s.reply(err))
        }).catch(err => s.reply(err))
    };
    function getList() {
        let _url = domain + "pw/thread.php?fid=" + id + "&page=" + pg;
        let _data = []
        s.reply('加载中...')
        return new Promise((resolve) => {
            comFn.requestPromise(_url).then(resp => {
                let _html = resp.replace(/\n|\s|\r/g, "")
                if (_html.indexOf('普通主题') !== -1) {
                    _html = _html.split("普通主题")[1]
                }
                const list = _html.match(/class=\"tr3t_one\">(\S*?)<\/h3>/g)
                list.map(item => {
                    if (item.indexOf('href=') !== -1) {
                        var id = item.match(/href=\"(\S*?)\"/)[1]
                        _data.push(id)
                    }
                })
                let path = _data[random(0, _data.length - 1)]
                resolve(path)
            })
        })
    }

    function getDetail(path) {
        return new Promise((resolve, reject) => {
            comFn.requestPromise(domain + "pw/" + path).then(resp => {
                const _html = resp.replace(/\n|\s|\r/g, "")
                const list = _html.match(/<br><imgsrc=\"(\S*?)\"/g)
                let html = ""
                list.map(item => {
                    let imgs = item.replace(/<br><imgsrc=\"/, "");
                    html += "<li><img src=\"" + imgs + "\"></li>";
                })
                resolve(getPicInHtml(html))
            }).catch(err => reject(err))
        })
    }

    function getPicInHtml(html) {
        let r = /<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g
        var _s = html.match(r)
        let list = []
        if (_s) {
            _s.forEach((item) => {
                list.push(item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1])
            })
        }
        return list
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
