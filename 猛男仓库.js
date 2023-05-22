/**
 * @author Yuheng | onz3v
 * @name 猛男仓库
 * @origin onz3v
 * @version 1.0.0
 * @description 猛男仓库 18+ 超nb资源 请勿滥用、请勿传播。
 * @rule ^(猛男仓库|mnck)$
 * @rule ^(猛男仓库|mnck)([\s\S]+)$
 * @admin true
 * @public true
 * @priority 999
 * @disable false
 * @statement 本插件仅供学习交流使用，严禁用于商业用途，否则后果自负。
 */
/* HideStart */
sysMethod.testModule(['axios'], { install: true });
sysMethod.testModule(['cheerio'], { install: true });
const axios = require('axios');
const cheerio = require('cheerio');
module.exports = async s => {
    const instance = axios.create({
        baseURL: 'https://mncks.buzz',
        timeout: 20 * 1000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
        }
    });
    const keywords = s.param(2) ? s.param(2).replace(/^\s+|\s+$/g, '') : '';
    const typeMap = {
        '158': '国产传媒',
        '246': '亚洲传媒',
        '327': '另类仓库',
        '343': '网曝门热',
        '316': '特色仓库',
        '161': '精品资源',
        '176': '中文字幕',
        '164': '大众精品',
        '165': '番号大全',
        '166': '富二代区',
        '177': '热门视频',
        '109': '伦理作品',
    }
    const type = '158'; // 默认选择国产传媒
    let page = 1;
    main();
    async function main() {
        let replyid = void 0;
        try {
            const url = keywords ? `/search/${encodeURI(keywords)}/n/${page}` : `/type/${type}/${page}`;
            const { list, totalPage: total } = await getList(url);
            let text = '请选择相关视频索引,输入q退出,输入p向上翻页,输入n向下翻页\n';
            list.map((item, index) => text += `【${index + 1}】${item.title}\n`)
            replyid = s.reply(text);
            const input = await s.waitInput(async () => { }, 60)
            const index = input?.getMsg();
            switch (index) {
                case 'q': throw ('已退出');
                case 'p':
                    if (page == 1) throw new Error('已经是第一页了')
                    page--;
                    main();
                    break;
                case 'n':
                    if (page == total) throw new Error('已经是最后一页了')
                    page++;
                    main();
                    break;
                default:
                    if (index > list.length || index < 1 || !+index) throw ('已退出')
                    const { link } = list[index - 1];
                    const chapter = await getPlayerList(link);
                    const playerUrl = await getPlayerUrl(chapter[0].link);
                    s.reply('https://m.auok.run/player/#' + playerUrl)
            }
        } catch (err) {
            s.reply(err)
        } finally {
            s.delMsg(replyid);
        }
    }
    function getList(url) {
        return new Promise(async (resolve, reject) => {
            _get(url).then(async res => {
                try {
                    const $ = cheerio.load(res);
                    const list = $('.block').map((i, el) => {
                        const title = $(el).find('.block-title').text().replace(/\n|\s|\r/g, '');
                        const link = $(el).find('.media-image a').attr('href');
                        const thumb = $(el).find('.media-image img').attr('src');
                        return { title, link, thumb }
                    }).get();
                    const totalPageMatch = $('.page_ul li').last().find('a').attr('href')?.match(/\/(\d+)$/);
                    let totalPage;
                    if (totalPageMatch) {
                        totalPage = totalPageMatch[1];
                    } else {
                        totalPage = 999;
                    }
                    resolve({
                        list, totalPage
                    });
                    if (!list?.length) throw new Error('获取列表失败');
                    resolve(list);
                } catch (err) {
                    s.reply(err)
                }
            }).catch(err => reject(err))
        })
    };
    // 获取播放列表
    function getPlayerList(link) {
        return new Promise(async (resolve, reject) => {
            _get(link).then(data => {
                const $ = cheerio.load(data);
                const playList = $('.play-list').map((i, el) => {
                    const title = $(el).find('a').attr('title');
                    const link = $(el).find('a').attr('href');
                    return { title, link };
                }).get();
                if (!playList.length) reject('获取播放器列表失败');
                resolve(playList);
            }).catch(err => reject(err))
        })
    }
    // 获取播放地址
    function getPlayerUrl(link) {
        return new Promise(async (resolve, reject) => {
            let addr = ''
            try {
                const data = (await _get(link)).replace(/\n|\s|\r/g, '');
                const $ = cheerio.load(data);
                const scripts = $('script').map((i, el) => $(el).html()).get();
                const script = scripts.find(item => item.includes('to_play'));
                let play_addr = '';
                if (script) {
                    const play_addr_match = script.match(/to_play\(\'(.*)\'\)/);
                    play_addr = play_addr_match[1];
                    const base64Content = play_addr.match(/http\:(.*)\.m3u8/)[1];
                    if (!base64Content) {
                        addr = ''
                    } else {
                        addr = base64Decode(base64Content);
                    }
                } else {
                    const _script = scripts.find(item => item.replace(/\n|\s|\r/g, '').includes('varplayUrl'));
                    addr = _script.replace(/\n|\s|\r/g, '').match(/varplayUrl=\'(.*)\'\;/)[1];
                }
            } catch (e) {
                reject(e)
            } finally {
                resolve(addr);
            }
        })
    }
    // 简易封装
    function _get(url, params) {
        const _url = params ? url + qsStringify(params) : url;
        return request('get', _url)
    }
    // base-64解码源码
    function base64Decode(input) {
        input = String(input)
            .replace(/[\t\n\f\r ]/g, '');
        var length = input.length;
        if (length % 4 == 0) {
            input = input.replace(/==?$/, '');
            length = input.length;
        }
        if (
            length % 4 == 1 ||
            // http://whatwg.org/C#alphanumeric-ascii-characters
            /[^+a-zA-Z0-9/]/.test(input)
        ) {
            return false;
        }
        var bitCounter = 0;
        var bitStorage;
        var buffer;
        var output = '';
        var position = -1;
        while (++position < length) {
            buffer = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(input.charAt(position));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
            // Unless this is the first of a group of 4 characters…
            if (bitCounter++ % 4) {
                // …convert the first 8 bits to a single ASCII character.
                output += String.fromCharCode(
                    0xFF & bitStorage >> (-2 * bitCounter & 6)
                );
            }
        }
        return output;
    }
    function _post(url, data) {
        return request('post', url, data)
    }
    function qsStringify(obj) {
        return '?' + Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
    }
    function request(method = 'get', url, data) {
        return new Promise((resolve, reject) => {
            instance[method](url, data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}