/**
 * @author Yuheng | onz3v
 * @name 油价查询
 * @origin onz3v
 * @version 1.0.0
 * @description 查询当地油价，仅支持省份查询。
 * @rule ^(全部油价)$
 * @rule ^(油价)([\s\S]+)$
 * @rule ^([\s\S]+)(油价)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 */

module.exports = async s => {
    const comFn = require('./lib/functions');
    const URL = 'https://api.help.bj.cn/apis/youjia/'
    const type = s.param(1);
    const provice = s.param(2) == '油价' ? s.param(1) : s.param(2);
    async function main() {
        const { data: oilList, update } = JSON.parse(await comFn._request({ url: URL }))
        let replyText = ``;
        const oilTypeList = oilList[0].slice(1)
        const oilListMap = {};
        oilList.slice(1).map(item => oilListMap[item[0]] = item.slice(1))
        if (type == '全部油价') {
            for (const key in oilListMap) {
                replyText += `${key}：\n`
                oilListMap[key].map((item, index) => replyText += `${oilTypeList[index]}：${item}\n`)
            }
        } else {
            if (oilListMap[provice]) {
                replyText += `查询省份：${provice}：\n`
                oilListMap[provice].map((item, index) => replyText += `${oilTypeList[index]}：${item}\n`)
            } else {
                return s.reply(暂无该省份油价信息)
            }
        }
        replyText += `油价更新时间：${update}\n`
        s.reply(replyText)
    };
    main();
};
