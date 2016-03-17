//create by zhaoyang
var page = angular.module("storage", []);

/**
 * 存储服务，使用本地存储，如果在浏览器，则使用localStorage
 * 使用key/value存储数据，数据可以是JSON对象
 */
page.factory("Store", function () {
    var store = {};
    /**
     * 获取本地存储中的特定对象
     *
     * @param key 存储key
     */
    store.getStorage = function (key) {
        return $api.getStorage(key);
    };

    /**
     * 将数据存储到本地存储
     *
     * @param key 存储key
     * @param value 数据value，可以使JSON对象
     */
    store.setStorage = function (key, value) {
        $api.setStorage(key, value);
    };

    /**
     * 删除本地存储中的值
     *
     * @param key 存储key
     */
    store.removeStorage = function (key) {
        $api.rmStorage(key);
    };

    return store;
});
