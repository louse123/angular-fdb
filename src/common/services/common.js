var page = angular.module("commonDirect", ['storage', 'dbBase']);
page.factory("Common", function ($resource, $rootScope, $http) {

    var common = {};
    common.baseURL = '<%= envVariable.apiURLBase%>'; // REST API根URL
    common.downLoadBaseURL = '<%= envVariable.mediaURLBase%>'; // 多媒体文件访问的根URL
    common.buildDownloadURL = function (key) {
        return common.downLoadBaseURL + key;
    };
    common.saveFile = function (json) {
        $http.post(common.baseURL + '/operation/saveDownLoadFile', json)
            .success(function (data) {
                if (data.rescode != 0) {
                    console.log(data.resmsg);
                } else {
                    $rootScope.user.headPic = data.file._id;
                }
            });
    };
    common.parse = function (iso8601) {
        var s = $.trim(iso8601);
        s = s.replace(/\.\d+/,""); // remove milliseconds
        s = s.replace(/-/,"/").replace(/-/,"/");
        s = s.replace(/T/," ").replace(/Z/," UTC");
        s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
        return new Date(s);
    };

    common.getDateDiff = function (dateTimeStamp){
        //JavaScript函数：
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var result = '';
        var month = day * 30;
        var now = new Date().getTime();

        var diffValue = now - dateTimeStamp;
        if(diffValue < 0){
            return "未來";
        }
        var monthC =diffValue/month;
        var weekC =diffValue/(7*day);
        var dayC =diffValue/day;
        var hourC =diffValue/hour;
        var minC =diffValue/minute;
        if(monthC>=1){
            result=parseInt(monthC) + "个月前";
        }
        else if(weekC>=1){
            result=parseInt(weekC) + "周前";
        }
        else if(dayC>=1){
            result=parseInt(dayC) +"天前";
        }
        else if(hourC>=1){
            result=parseInt(hourC) +"个小时前";
        }
        else if(minC>=1){
            result=parseInt(minC) +"分钟前";
        }else
            result="刚刚";
        return result;
    };
    return common;
});
