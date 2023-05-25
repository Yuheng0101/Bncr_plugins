/**
 * @author yuheng
 * @name 抖阴短视频
 * @platform tgBot HumanTG
 * @origin onz3v
 * @version 1.0.0
 * @description  抖阴短视频 18+ 请勿滥用、请勿传播。
 * @source https://tt8teen.com/
 * @rule ^(dyin|抖阴)$
 * @admin true
 * @public true
 * @priority 999
 * @disable false
 */
const axios = require('axios')
module.exports = async (s) => {
    /** Code Encryption Block[419fd178b7a37c9eae7b7426c4a04203e4a4e3ed21ccc06b07157b1fc89b37186d872e86b57cd2ef9c08a64cd62d7f5eb507bedb6c5c98a0540014b5d1e13f49b1e75555ab169df4f10ec569409d8d885f09dbbfda47ede53e63f73bc3cb724494518bbb2f3c26fc8748b50dfdad774ecfd9e8a3a9da00aeef64a9052a0de70150c6ef233edfcac9f169a462d4147093f459e449c6a276bef39efa42447512f242a48a2e3457a128c7d022ba59dbcc0ee3070e23f753efa65e2abdff2774f9a26632127a323d882bf8897da23875946650898a7c9b619ca7ed8542a18205704f4480a21701fa34ffb652970d066f16c9d3f74586642db01112aab3db3b20c2f3a30b99db2238f647d5093ee647607deaad277cc192ad359fc0e51c1abca91bf60f7d21f65a674c5327fa4ef8f4ac8574b1b226fb39a166e094ba3b6074526f15696742443b4e3a3827d54ee286cb745687a99a83488f4a0da391535709093810eb64eeb02fa4e95c0764b68cbcc8fd1ae70aa6317c041ea614b20e4c2d0a3e9b5cf03a77a4e84917080218bf86d373ee4ba5b5607cdb554ce6d8624dfd333f28acf767cca39a1d3fd7fcf802e5d33b8d0ca874ae01e965e517b0d23f6fd397f8a3134e23be31754da5d3bd8dbca76ea855e04650e940821eeba219bc2513264bb704e6cfb2ca244d19f129ede0d5e0c3f89c8cfbffe2d4186efbf43d9520b64d755c70e0f79f1032e2f4dc2b7d2fe38e66df8cf2914797650bcbaee6c461f3238e74fe6d5396968c361546deb64ec1a01e7baa518cdd8702c6133e078100225fff0f229ccd21c4b23264d557284e27bdf4cded17a372cd580f3a01ce1b272c0ac6f0d4a9e8c7ae158b4fa826d91a9e7ea5ac650a8e73350a68c5309046e29b873cbf42ba726e5735bb25fd0fdbe3f589a77e04e1282022885fc46fd5e800c1fbdf937a2c4fd673077137f9a83a0ad84c016adf4f4d85fad7396c4f97259d1c7ef935222d0e4a5d24c1766a6d07ea6790ddb7c666e194924701a3d4cb1b96892d8384f10eaf24ec509576c17e8e13858a62d4835427494e52e79d101cc65ade625a0cd1c258961587f14da04fd64862eb] */
    post('/v1/recommend/index',
        {
            "params": {
                "navId": "6"
            },
            "common": {
                "_dId": "Redmi+K30+Pro+Zoom+Edition",
                "_token": "",
                "_uId": "",
                "_lang": "en",
                "_appLanguage": "en",
                "_vOs": "10",
                "_vApp": "119",
                "_vName": "1.1.9",
                "_region": "en",
                "_pcId": "douyin18me",
                "_pName": "com.smd.douyin18.app",
                "_udid": "d589daaf-42b2-4b57-9665-4c77a3885329",
                "_aKey": "ANDROID"
            }
        })
        .then(res => {
            const mediaList = res.data.medias;
            const list = mediaList.map(item => item.video.playUrl[0].url)
            const rdmIdx = Math.floor(Math.random() * list.length);
            const rdmVideo = list[rdmIdx];
            s.reply({
                type: 'video',
                msg: '',
                path: rdmVideo
            })
        })
        .catch(err => {
            console.log(err)
        })
}