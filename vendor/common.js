/**
 * Created by libin on 2015/9/8.
 */
/**
 * 配置信息
 */
(function () {
    /**
     *
     * 添加字符串的format方法，用于格式化字符串。可以添加多个参数，或者使用一个数组作为参数
     *
     * 示例："a{0}b{0}c{1}".format('***', 123)的结果为：a***b***c123
     *
     */
    String.prototype.format = function (args) {
        var str = this;
        if (arguments.length == 0) {
            return str;
        }
        var params = arguments.length === 1 && arguments[0] instanceof Array ? arguments[0] : arguments;
        for (var i = 0; i < params.length; i++) {
            var re = new RegExp('\\{' + i + '\\}', 'gm');
            str = str.replace(re, params[i]);
        }
        return str;
    };

    /**
     *
     * 添加字符串的trim方法，用于去掉字符串开头和结尾的空格。
     *
     * 示例：" a a bc ".trim()的结果为：a a bc
     *
     */
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    Math.uuid = function (len, radix) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence
            // as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    };

    Math.randomInt = function (max) {
        return parseInt(Math.random() * max);
    };

    Function.prototype.createDelegate = function (context) {
        var _t = this;
        return function () {
            _t.apply(context, arguments);
        };
    };

    /**
     * Date添加format方法，支持：MdHmsqS 月日小时分秒季度毫秒
     *
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format = function (fmt) { // author: meizz
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "H+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                    .substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * Array加个contain方法
     *
     * @param obj
     * @returns {boolean}
     */
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
})();