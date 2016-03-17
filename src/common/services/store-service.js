/**
 * Created by Administrator on 2015/6/25.
 */

angular.module('service.mediaUpload', ['commonDirect'])
    .factory('MediaUploadService', function ($http, Common,$rootScope) {
        return {
            upload: function (path, type, callback) {
                $http.get(Common.baseURL + '/store/token/upload', {
                    responseType: 'json'
                }).success(function (data, status, headers, config) {
                        if (data && data.rescode === 0 && data.uptoken) {
                            api.ajax({
                                url: 'http://upload.qiniu.com',
                                method: 'post',
                                dataType: 'json',
                                data: {
                                    values: {
                                        key: type + '/' + Math.random(32).toString() + path.substr(path.lastIndexOf('.')),
                                        token: data.uptoken
                                    },
                                    files: {
                                        file: path
                                    }
                                }
                            }, function (data, err) {
                                callback(err, data);
                            });
                        } else {
                            alert("return !");
                            callback('uptoken not found!');
                        }
                    })
                    .error(function (data, status, headers, config) {
                        alert('ERR: ' + data);
                        alert('ERR: ' + status);
                        alert('ERR: ' + headers);
                        alert('ERR: ' + config);
                        callback(null, data);
                    });
            },
            buildDownloadURL:function(key) {
                return 'http://media.fudaobang.cn/' + key;
            }
        };
    });