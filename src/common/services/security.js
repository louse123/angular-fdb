/**
 * 处理安全认证相关内容
 *
 * Created by bean on 2015/9/8.
 */
angular.module('security', ['storage'])
    .factory("SecurityService", function (Store) {
        /**
         * 用户认证相关方法
         *
         * @type {{client: {id: string, sk: string}, setToken: Function, getToken: Function, authed: Function, getUserToken: Function}}
         */
        var s = {
            client: {
                id: '3b000a880675433fb43f5c8fcae497d8',
                sk: 'dc0cfed972e54df9b89d46561ea2202a'
            },
            /**
             * 登陆后将获取的token存储到本地
             * @param token 登录后获取的token
             */
            setToken: function (token) {
                token.expire_time = Date.now() + 1000 * token.expires_in;
                Store.setStorage('OAUTH_TOKEN', token);
            },
            /**
             * 获取本地存储的token
             */
            getToken: function () {
                return Store.getStorage('OAUTH_TOKEN');
            },
            /**
             * 判断用户是否已认证
             * @returns {*|boolean}
             */
            authed: function () {
                var token = s.getToken();
                return token && token.expire_time > Date.now();
            },
            /**
             * 获取用户token字符串，用于认证API请求
             * @returns {string}
             */
            getUserToken: function () {
                var token = s.getToken();
                return token.token_type + ' ' + token.access_token;
            }
        };
        return s;
    });