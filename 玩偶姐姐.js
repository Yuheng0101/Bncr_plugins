/**
 * @author Yuheng | onz3v
 * @name 玩偶姐姐
 * @origin onz3v
 * @version 1.0.0
 * @description  18+ 请勿滥用 资源来源A姐分享.
 * @rule ^wojj$
 * @rule ^玩偶姐姐$
 * @admin true
 * @public true
 * @priority 99999
 * @disable false
 */
module.exports = async s => {
    const list = [
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221204/dDLVEjQM/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221204/dDLVEjQM/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20230129/zqeHgwbd/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/ph/gr/7v/78/af7b145ecae246b2ac79cecb6f47f6ad.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/j3/i6/yf/uj/4c59de88250d4dce94d5e5260a48468a.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/k6/r5/4l/88/60aac9f4edee40078853a86817ead1ff.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/74/oh/ov/ky/be6214b2998f4f33a65d8e879fc77c8e.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/yu/mt/0k/df/68768a0f7843400c91a65843e069f9fa.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/8c/sf/lc/5c/34774a9c12b649619c8f4049759c35bf.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/qy/yi/94/89/6dc3c8cb9112436682a5af22588f52a0.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/jm/jr/pg/bh/03dd6e239b5c40ceb3b156344a64b372.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/si/p3/76/69/ff14c7c54f1143ddaacac8810fdb8e90.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/qy/fi/ih/p7/dd522f6b3bd64097ba0e4350b9e65e1c.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/b3/tk/kw/y1/4cbb66dfcd884546994ebf0fe557635d.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/8v/45/pi/sf/049e460a47e94faabd6e1b7bda0bb6ba.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220102/MWEjUEmA/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/f3/op/3a/ja/1bfcd36a631e400f9e673a66fbfb7385.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220807/thM7wsId/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220823/sFbrS6lG/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/uu/7f/bg/b5/28ed051cdec84ccc98cb9a8a72b2a1aa.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/ex/yn/el/3k/09f83fc673314e1c8fda7139737b4f1a.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/us/6e/s5/8s/72622236ce244252b9726a3530820f28.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/yf/kq/h5/62/0edc074baab140e1976e12e1099d70d2.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/qu/rw/07/7u/3f708cc50f054574b72074d960e31609.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220713/pU4sKd7M/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/2v/hl/ll/f0/ec17339c89b348b3a3d66edfeb412b24.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/qy/yi/94/89/6dc3c8cb9112436682a5af22588f52a0.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/gj/v2/mf/a8/77534e95584448e4a62d3205b260e398.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/11/pw/5m/9o/7767714a57434242a353b23d4a3ef841.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/cg/ph/pg/jv/e48dfc4be58e4e6dab20065a71925079.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/8t/0r/9y/ho/5819556d96384d6f8b0db87e873e440a.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/u2/ni/d4/7e/8b76511993614e2c84bcf6a7e2ead496.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/i6/ic/gf/sz/5aae7ba090374eb89fa4cf650d8a8c27.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220623/M51SpQDH/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20230201/SJ4Xi371/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20230127/JnUEZ6Of/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221221/esuqsIX3/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221130/2afJFH36/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/pc/pl/12/8b/e42a460570f24b01a74d96680dda0786.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20220820/UJzhqJ5w/hls/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221105/J0hLzAts/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/69/jb/bi/fw/20126e7e0a12462b918d967cf87b8bda.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/am/jr/eo/yr/895402a7622e48228f71fb2b874345d6.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/hr/mw/v7/cj/91fbc7eb82a449148ab6a0b58d5b9268.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/a4/f2/bf/ak/6efd2825848243879a24c6eaac25c86f.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/pp/hh/cs/je/277847fb29e14f0c9925baf67fea96f0.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/h3/pc/tc/pu/17ade76bc5b64b7dbe4849cea2d79ae4.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/ca/jp/jl/up/b792f63ce5eb40b591b2f99d0cf975bd.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/kv/y2/py/nv/edce4ada13884f1591c8af5e1063a192.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/zh/ep/gu/9m/4l/fbcbd17845504371b6e95ff3b2086a45.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/do/4z/d7/k4/f51157f041264e4cb4490dd344803668.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/ff/4b/yn/rh/b181c716e35f48d1aee0063c5f714be1.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/ye/rp/r8/bb/7c2fa3a7fca04875a56f3eb710a41224.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20211103/fF6r1loI/hls/index.m3u8',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/jv/t1/9o/ji/6c4a0c8b190944bc8dee75fc8e37cc67.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/eo/hw/ag/q1/1105642eb79f45f580c473c9fcb64725.m3u8?',
        'https://m.auok.run/player/#https://ypmnkbb.saejeuj.com/api/app/media/m3u8/av/lu/2b/qx/84/13f8f69e45ff4c85ac114a3df7b1ca9e.m3u8?',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20210918/pg4sWQLe/index.m3u8',
        'https://m.auok.run/player/#https://v4.cvhlscdn.com/20221105/0NXbWItw/hls/index.m3u8'
    ];
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const index = random(0, list.length - 1);
    s.reply(list[index])
}