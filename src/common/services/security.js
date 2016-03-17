/**
 * ����ȫ��֤�������
 *
 * Created by bean on 2015/9/8.
 */
angular.module('security', ['storage'])
    .factory("SecurityService", function (Store) {
        /**
         * �û���֤��ط���
         *
         * @type {{client: {id: string, sk: string}, setToken: Function, getToken: Function, authed: Function, getUserToken: Function}}
         */
        var s = {
            client: {
                id: '3b000a880675433fb43f5c8fcae497d8',
                sk: 'dc0cfed972e54df9b89d46561ea2202a'
            },
            /**
             * ��½�󽫻�ȡ��token�洢������
             * @param token ��¼���ȡ��token
             */
            setToken: function (token) {
                token.expire_time = Date.now() + 1000 * token.expires_in;
                Store.setStorage('OAUTH_TOKEN', token);
            },
            /**
             * ��ȡ���ش洢��token
             */
            getToken: function () {
                return Store.getStorage('OAUTH_TOKEN');
            },
            /**
             * �ж��û��Ƿ�����֤
             * @returns {*|boolean}
             */
            authed: function () {
                var token = s.getToken();
                return token && token.expire_time > Date.now();
            },
            /**
             * ��ȡ�û�token�ַ�����������֤API����
             * @returns {string}
             */
            getUserToken: function () {
                var token = s.getToken();
                return token.token_type + ' ' + token.access_token;
            }
        };
        return s;
    });