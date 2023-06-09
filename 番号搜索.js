/**
 * @author yuheng
 * @name 番号搜索
 * @origin yuheng
 * @version 1.0.0
 * @description 对 https://javlist.me 的爬取学习
 * @rule ^(fh|番号)([\s\S]+)$
 * @admin true
 * @public true
 * @priority 99999
 * @disable false
 */
const scriptName = 'MYAV番号';
const cheerio = require('cheerio');
module.exports = async s => {
    const $ = new Env(scriptName);
    const domain = `https://javlist.me`;
    !(async () => {
        const searchVal = s.param(2)?.trim();
        const list = await search(searchVal);
        let replyText = list.map((item, index) => `【${index + 1}】.${item.title}`).join('\n');
        replyText += '\n\n回复对应数字获取番号磁链接';
        const reply = await s.reply(replyText);
        let input = await s.waitInput(async () => { }, 120)
        if (!input) return s.reply("退出成功") // 超时
        const _t = input.getMsg();
        if (isNaN(Number(_t)) || _t < 1 || _t > list.length) return s.reply("输入有误,退出成功")
        const index = +_t - 1;
        const _item = list[index];
        await s.delMsg(reply)
        $.log(`开始获取磁链接：${_item.title}`)
        const { magnetList, previewUrl } = await getMagnet(_item.link);
        previewUrl && await s.reply({
            type: 'video',
            path: previewUrl,
            msg: '',
            dontEdit: true
        })
        const msg = magnetList.map((item, index) => `【${item.title}】.\n${item.link}`).join('\n');
        await s.reply(msg);
    })()
        .catch(err => {
            $.logErr(err)
            s.reply(err)
        })
        .finally(() => $.done());
    function search(val) {
        const url = `${domain}/search.php?s=${val}&code=3372636995&hash=e2283703fb9b90ddb50b62681679f479&cat=1`
        return new Promise((resolve, reject) => {
            $.http.get(url)
                .then(({ body: html }) => {
                    const _$ = cheerio.load(html);
                    const list = _$('.post').map((_, item) => {
                        const $item = _$(item).find('.img a');
                        const link = $item.attr('href');
                        const title = $item.attr('title');
                        return { title, link }
                    }).get();
                    if (!list.length) return reject('未找到相关番号');
                    resolve(list);
                })
                .catch(err => reject(err))
        });
    }
    function getMagnet(url) {
        return new Promise((resolve, reject) => {
            $.http.get(domain + url)
                .then(({ body: html }) => {
                    const _$ = cheerio.load(html);
                    const magnetList = _$('#Magnet_link [id^=magnet_]').map((_, item) => {
                        const $item = _$(item);
                        const title = $item.text();
                        /** Code Encryption Block[f5ce8b1d1d171bf6c4af4f6ff3238aaaa9aa63f8be80535f2a54fdef9aa9320ae7f8491c63f9b49e38be2499323dcea0a55e98021de1c581418691ef8f0df54253d768bf1bb4cc54b633ca32dd5373d013c530acc4eb8326e39254f7653301197922acf2cbda82c9893043a473d7e0e5] */
                        return { title, link }
                    }).get();
                    if (!magnetList.length) return reject('未找到磁链接');
                    const M3U8Script = _$('script').filter((_, item) => _$(item).html().includes('const dp = new DPlayer({')).html();
                    const previewUrl = M3U8Script.match(/url: '(.*)',/)[1];
                    resolve({ magnetList, previewUrl });
                })
                .catch(err => reject(err))
        })
    }
    /** Code Encryption Block[419fd178b7a37c9eae7b7426c4a04203df62e54945024d2a6614f6d7b90b3b1e077921aff2b89fa869a74002537f68a50850cd2a8dc50c2076e57d6a07827a0f5d0fe1d9c88158427049c96ee24c295b0420b0d5f080eacb7a341fd0ac0ff19189e4e911b5433f410f9bc54f62a7cbc15a43d796bfb8c09ee0a0f2ac1cd156f5b69cb3f728ba73b3b050f105bc20d4e872e08f2db2431c6eea098a9ca923e6f32ec429f5dcc0b20306964605e1374d78bd0f59e1d98181b14115d06db85f18e1d28424e5411c1730e8b48d4e9d4f12222ebb7a5f24bca0f3a128a47b23e03d2962a1debdcab27934aa42a78efeeb12fa0471d132b6c32253a6f7cb63c6f76f5baa78a768efda3463223c836c0e37d7dd8265781e0977cb33c5b58ca288244461d5f5da5c08d53b6b49f1f37983cd5c72b756c2407c00a07005da391e76ce7f30e6b2a5b6a9f648e3856f7c2029c4ca3b0086171427dc0e9272eb2a6f71811187deccdd27a8dc4578909efde8a55d52220262ce3a4435862b04d321a891bd498b8aed123190dbddbd9ce25b70dd2c492688d3212ac0c1053bf60a2da3b78bbcc91fa57dd4587dd922155012abe0eb5f23668a589a5543c1cd1dd9991339336a32a0c7b7c485a9e90d9d532d0337660a34b930838e65d2f6df41baab860dc7a6a5e7f7d621b769b3bca6afdc9211542580426ab1574f6cb4eb7c7f220ea111ff8822e604ac23dd494cf1c508f01270cdcb79c499700870cd54b110118d0f0c5ca5715750af4d9a76e7f13305939952ba2431279547ffe393dd124a52e7c007be9b78085aef54a074b0d4bcede0df6315e8cd1813dc05d1d63f69ea330922ec60baa2da734131002fe27a9e879a8a54a5971d91625940ba83e06b5417303de95bdaf35954024a5dcd3ae8d2b2af2de762d587cb9bffc3bb1ebbe47885a5b39211702e78b7536e8ddf1b1c0856f836c61648519a062d3f78098a7c860a98610ba4ecd86e681498ba3560a2910297afcbe5930a163ddfcc3c8705dd133e8bf89c1ee7b4dbfae37509607f7164dc14049638eaa285163876c80afeadaf7b011bdb3e045c919c2bae86be45b487bbba0fbaeb7c00edcd0792fdc5c589bd1c981841c75d44a531c49a1db2e35cb302dd23a337ccf16c15371db5618d37ed7109ca6ee0dd7012c5a91da8a350e8de1ca5d76543ac30df32ed9eb260b1b4c3e8cf6e8f18a4a4487d91e952b3fe72a3076cc68562c595ccccca602e434c411a9f3e06dad999d14240ab5fb79ec4fa01b9567acd3799243e90657c366f8965ea4663b67680065fcc5c223a513eceb32e5ac3e7af169c6c495906a933b0c36cdab5c716c466b590fc01b1e344478badb50f5556de6d9119fd98f5191aa57e54604993fda6a6ae29e6115143b031d122e1cb21563340508c9fd083df89581e0ab55d0a35d544ca76de36251f4b882fd4e9465bb688626d961500fef88b81c33a62aa06a893c154e9b73b583ad88e2103f93ac7d1c8dfd7c2ce20f7153cdeca4e575d387f8ab37652e09f6fde4ee0bd43f053f648d1ea6ea1ce512f013f6f11b5eb04c9db4a287810e1b51a365e82295fec735837cd0c7dda7b798ffaf804c8847fc4856f254858c6bf5b783cbc916e2233fb4125007875912f10e40624e8100a989b27933125a502240790122c9853a8b701e9b5bb1fdc6ecc0e3521b03590fc9426f2bad2feaeb250b29883c88a9d5f094aae88ad02e5] */
};

function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }
        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? { url: opts } : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }
            return new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(resp)
                })
            })
        }

        get(opts) {
            return this.send.call(this.env, opts)
        }

        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }

    return new (class {
        constructor(name, opts) {
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.encoding = 'utf-8'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name}, 开始!`)
        }

        getEnv() {
            if ('undefined' !== typeof $environment && $environment['surge-version'])
                return 'Surge'
            if ('undefined' !== typeof $environment && $environment['stash-version'])
                return 'Stash'
            if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
            if ('undefined' !== typeof $task) return 'Quantumult X'
            if ('undefined' !== typeof $loon) return 'Loon'
            if ('undefined' !== typeof $rocket) return 'Shadowrocket'
        }

        isNode() {
            return 'Node.js' === this.getEnv()
        }

        isQuanX() {
            return 'Quantumult X' === this.getEnv()
        }

        isSurge() {
            return 'Surge' === this.getEnv()
        }

        isLoon() {
            return 'Loon' === this.getEnv()
        }

        isShadowrocket() {
            return 'Shadowrocket' === this.getEnv()
        }

        isStash() {
            return 'Stash' === this.getEnv()
        }

        toObj(str, defaultValue = null) {
            try {
                return JSON.parse(str)
            } catch {
                return defaultValue
            }
        }

        toStr(obj, defaultValue = null) {
            try {
                return JSON.stringify(obj)
            } catch {
                return defaultValue
            }
        }

        getjson(key, defaultValue) {
            let json = defaultValue
            const val = this.getdata(key)
            if (val) {
                try {
                    json = JSON.parse(this.getdata(key))
                } catch { }
            }
            return json
        }

        setjson(val, key) {
            try {
                return this.setdata(JSON.stringify(val), key)
            } catch {
                return false
            }
        }

        getScript(url) {
            return new Promise((resolve) => {
                this.get({ url }, (err, resp, body) => resolve(body))
            })
        }

        runScript(script, runOpts) {
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata(
                    '@chavy_boxjs_userCfgs.httpapi_timeout'
                )
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout =
                    runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http://${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: { 'X-Key': key, 'Accept': '*/*' },
                    timeout: httpapi_timeout
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }

        loaddata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(
                    process.cwd(),
                    this.dataFile
                )
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile =
                    !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile
                        ? curDirDataFilePath
                        : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(
                    process.cwd(),
                    this.dataFile
                )
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile =
                    !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }

        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }

        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
            path
                .slice(0, -1)
                .reduce(
                    (a, c, i) =>
                        Object(a[c]) === a[c]
                            ? a[c]
                            : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
                    obj
                )[path[path.length - 1]] = value
            return obj
        }

        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }

        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey
                    ? objdat === 'null'
                        ? null
                        : objdat || '{}'
                    : '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }

        getval(key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.read(key)
                case 'Quantumult X':
                    return $prefs.valueForKey(key)
                case 'Node.js':
                    this.data = this.loaddata()
                    return this.data[key]
                default:
                    return (this.data && this.data[key]) || null
            }
        }

        setval(val, key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.write(val, key)
                case 'Quantumult X':
                    return $prefs.setValueForKey(val, key)
                case 'Node.js':
                    this.data = this.loaddata()
                    this.data[key] = val
                    this.writedata()
                    return true
                default:
                    return (this.data && this.data[key]) || null
            }
        }

        initGotEnv(opts) {
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if (opts) {
                opts.headers = opts.headers ? opts.headers : {}
                if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
                    opts.cookieJar = this.ckjar
                }
            }
        }

        get(request, callback = () => { }) {
            if (request.headers) {
                delete request.headers['Content-Type']
                delete request.headers['Content-Length']

                // HTTP/2 全是小写
                delete request.headers['content-type']
                delete request.headers['content-length']
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, { 'X-Surge-Skip-Scripting': false })
                    }
                    $httpClient.get(request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, { hints: false })
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null,
                                { status, statusCode, headers, body, bodyBytes },
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    this.got(request)
                        .on('redirect', (resp, nextOpts) => {
                            try {
                                if (resp.headers['set-cookie']) {
                                    const ck = resp.headers['set-cookie']
                                        .map(this.cktough.Cookie.parse)
                                        .toString()
                                    if (ck) {
                                        this.ckjar.setCookieSync(ck, null)
                                    }
                                    nextOpts.cookieJar = this.ckjar
                                }
                            } catch (e) {
                                this.logErr(e)
                            }
                            // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                        })
                        .then(
                            (resp) => {
                                const {
                                    statusCode: status,
                                    statusCode,
                                    headers,
                                    rawBody
                                } = resp
                                const body = iconv.decode(rawBody, this.encoding)
                                callback(
                                    null,
                                    { status, statusCode, headers, rawBody, body },
                                    body
                                )
                            },
                            (err) => {
                                const { message: error, response: resp } = err
                                callback(
                                    error,
                                    resp,
                                    resp && iconv.decode(resp.rawBody, this.encoding)
                                )
                            }
                        )
                    break
            }
        }

        post(request, callback = () => { }) {
            const method = request.method
                ? request.method.toLocaleLowerCase()
                : 'post'

            // 如果指定了请求体, 但没指定 `Content-Type`、`content-type`, 则自动生成。
            if (
                request.body &&
                request.headers &&
                !request.headers['Content-Type'] &&
                !request.headers['content-type']
            ) {
                // HTTP/1、HTTP/2 都支持小写 headers
                request.headers['content-type'] = 'application/x-www-form-urlencoded'
            }
            // 为避免指定错误 `content-length` 这里删除该属性，由工具端 (HttpClient) 负责重新计算并赋值
            if (request.headers) {
                delete request.headers['Content-Length']
                delete request.headers['content-length']
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, { 'X-Surge-Skip-Scripting': false })
                    }
                    $httpClient[method](request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    request.method = method
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, { hints: false })
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null,
                                { status, statusCode, headers, body, bodyBytes },
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    const { url, ..._request } = request
                    this.got[method](url, _request).then(
                        (resp) => {
                            const { statusCode: status, statusCode, headers, rawBody } = resp
                            const body = iconv.decode(rawBody, this.encoding)
                            callback(
                                null,
                                { status, statusCode, headers, rawBody, body },
                                body
                            )
                        },
                        (err) => {
                            const { message: error, response: resp } = err
                            callback(
                                error,
                                resp,
                                resp && iconv.decode(resp.rawBody, this.encoding)
                            )
                        }
                    )
                    break
            }
        }
        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {string} fmt 格式化参数
         * @param {number} 可选: 根据指定时间戳返回格式化日期
         *
         */
        time(fmt, ts = null) {
            const date = ts ? new Date(ts) : new Date()
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            }
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length)
                )
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                    )
            return fmt
        }

        /**
         *
         * @param {Object} options
         * @returns {String} 将 Object 对象 转换成 queryStr: key=val&name=senku
         */
        queryStr(options) {
            let queryString = ''

            for (const key in options) {
                let value = options[key]
                if (value != null && value !== '') {
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    }
                    queryString += `${key}=${value}&`
                }
            }
            queryString = queryString.substring(0, queryString.length - 1)

            return queryString
        }

        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts) {
            const toEnvOpts = (rawopts) => {
                switch (typeof rawopts) {
                    case undefined:
                        return rawopts
                    case 'string':
                        switch (this.getEnv()) {
                            case 'Surge':
                            case 'Stash':
                            default:
                                return { url: rawopts }
                            case 'Loon':
                            case 'Shadowrocket':
                                return rawopts
                            case 'Quantumult X':
                                return { 'open-url': rawopts }
                            case 'Node.js':
                                return undefined
                        }
                    case 'object':
                        switch (this.getEnv()) {
                            case 'Surge':
                            case 'Stash':
                            case 'Shadowrocket':
                            default: {
                                let openUrl =
                                    rawopts.url || rawopts.openUrl || rawopts['open-url']
                                return { url: openUrl }
                            }
                            case 'Loon': {
                                let openUrl =
                                    rawopts.openUrl || rawopts.url || rawopts['open-url']
                                let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                                return { openUrl, mediaUrl }
                            }
                            case 'Quantumult X': {
                                let openUrl =
                                    rawopts['open-url'] || rawopts.url || rawopts.openUrl
                                let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                                let updatePasteboard =
                                    rawopts['update-pasteboard'] || rawopts.updatePasteboard
                                return {
                                    'open-url': openUrl,
                                    'media-url': mediaUrl,
                                    'update-pasteboard': updatePasteboard
                                }
                            }
                            case 'Node.js':
                                return undefined
                        }
                    default:
                        return undefined
                }
            }
            if (!this.isMute) {
                switch (this.getEnv()) {
                    case 'Surge':
                    case 'Loon':
                    case 'Stash':
                    case 'Shadowrocket':
                    default:
                        $notification.post(title, subt, desc, toEnvOpts(opts))
                        break
                    case 'Quantumult X':
                        $notify(title, subt, desc, toEnvOpts(opts))
                        break
                    case 'Node.js':
                        break
                }
            }
            if (!this.isMuteLog) {
                let logs = ['', '==============📣系统通知📣==============']
                logs.push(title)
                subt ? logs.push(subt) : ''
                desc ? logs.push(desc) : ''
                console.log(logs.join('\n'))
                this.logs = this.logs.concat(logs)
            }
        }

        log(...logs) {
            if (logs.length > 0) {
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.join(this.logSeparator))
        }

        logErr(err, msg) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                case 'Quantumult X':
                default:
                    this.log('', `❗️${this.name}, 错误!`, err)
                    break
                case 'Node.js':
                    this.log('', `❗️${this.name}, 错误!`, err.stack)
                    break
            }
        }

        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
            this.log()
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                case 'Quantumult X':
                default:
                    $done(val)
                    break
                case 'Node.js':
                    // process.exit(1)
                    break
            }
        }
    })(name, opts)
}