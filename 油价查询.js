/**
 * @author Yuheng | onz3v
 * @name 油价查询
 * @origin onz3v
 * @version 1.0.1
 * @update 20230522 重构代码 使用爬虫而非接口
 * @description 查询当地油价 仅支持省份查询 例：山东油价、油价山东、全部油价
                秉着开源精神，后续代码除牵扯重要算法外均开源，欢迎各位大佬指点
 * @rule ^(全部油价)$
 * @rule ^(油价|yj)([\s\S]+)$
 * @rule ^([\s\S]+)(油价)$
 * @admin false
 * @public true
 * @priority 999
 * @disable false
 */

sysMethod.testModule(['axios'], { install: true });
sysMethod.testModule(['cheerio'], { install: true });
const axios = require('axios');
const cheerio = require('cheerio');
module.exports = async s => {
    // 全局axios配置
    const request = axios.create({
        baseURL: 'http://youjia.data777.com', // 基础域名
        timeout: 10 * 1000, // 超过10s超时
    })
    // 获取全部油价列表
    request('/').then(res => {
        const $ = cheerio.load(res.data); // 使用cheerio解析html
        try {
            const list = $('.mainnr').find('tr').map((_, el) => {
                if (!$(el).html().trim()) return; // 过滤空行
                const provice = $(el).find('td').eq(0).text().trim(); // 省份
                const priceOf92 = $(el).find('td').eq(1).text().trim(); // 92号汽油
                const priceOf95 = $(el).find('td').eq(2).text().trim(); // 95号汽油
                const priceOf98 = $(el).find('td').eq(3).text().trim(); // 98号汽油
                const priceOf0 = $(el).find('td').eq(4).text().trim(); // 0号柴油
                const updateTime = $(el).find('td').eq(5).text().trim(); // 更新时间
                return { provice, priceOf92, priceOf95, priceOf98, priceOf0, updateTime }
            })
                // 转换为数组
                .get()
                // 过滤表头
                .filter((_, index) => index > 0);
            if (!list.length) throw new Error('查询失败'); // 抛出异常
            // 此处按照用户指令进行操作
            const input = s.param(2) == '油价' ? s.param(1) : s.param(2); // 前者为山东油价匹配或者是全部油价(这里需要判断)，后者为油价|yj山东匹配
            if (!list.map(item => item.provice).includes(input)) throw new Error('请输入省份查询油价') // 抛出异常
            let replyText = '查询结果：\n';
            const getText = (item) => `【${item.provice}】:\n92号汽油：${item.priceOf92}\n95号汽油：${item.priceOf95}\n98号汽油：${item.priceOf98}\n0号柴油：${item.priceOf0}\n更新时间：${item.updateTime}\n`
            input == '全部油价' && list.map(item => replyText += getText(item));
            input != '全部油价' && list.map(item => item.provice == input && (replyText += getText(item)));
            // 最后输出
            s.reply(replyText);
        } catch (err) {
            // console.log(err)
            s.reply(err)
        }
    }).catch(err => {
        // console.log(err)
        s.reply('查询失败', err)
    })
};
