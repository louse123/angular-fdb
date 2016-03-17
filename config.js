var _ = require('underscore');

// 公用参数配置
var config = {
    mediaURLBase: 'http://media.fudaobang.cn/' // 图片、音视频下载路径
};

// 开发模式参数配置
var devConfig = {
    apiURLBase: 'http://192.168.2.57:3000' // REST API 根路径
};
// 测试模式参数配置
var testConfig = {
    apiURLBase: 'http://192.168.2.151:3000' // REST API 根路径
};
// 生产模式参数配置
var productConfig = {
    apiURLBase: 'https://api.fudaobang.cn' // REST API 根路径
};

module.exports = function (env) {
    if (!env) env = 'product';
    switch (env) {
        case 'dev' :
            return _.extend(config, devConfig);
            break;
        case 'test':
            return _.extend(config, testConfig);
            break;
        case 'product' :
        default:
            return _.extend(config, productConfig);
    }
};