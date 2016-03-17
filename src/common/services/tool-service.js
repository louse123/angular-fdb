var page = angular.module('tool', ['storage', 'dbBase']);

page.factory('Tool', function($resource, $rootScope, $q,Store){
    var tool={};
    //用于格式化时间(悬赏列表)
    tool.getTimeDiff = function(passDate){
        var timeText='';
        var nowDate = new Date();

        //计算毫秒数
        var date = nowDate.getTime()-passDate.getTime();
        //计算天数
        var days = Math.floor(date/(24*3600*1000));
        if(days<0){timeText = '未知'};
        if(days>0 && days<30){timeText = days + '天前'};
        if(days>=30 && days<365){
            var months = Math.floor(days/30);
            timeText =  months + '个月前';
        }
        if(days>=365){
            var years = Math.floor(days/365);
            timeText = years + '年前';
        }
        //计算小时数
        var levae1 = date%(24*3600*1000);
        var hours = Math.floor(levae1/(3600*1000));
        if(hours>0 && days == 0){timeText = hours + '小时前'}

        //计算相差的分钟数
        var levae2 = levae1%(3600*1000);
        var mimutes = Math.floor(levae2/(60*1000));
        if(mimutes>0 && days == 0 && hours == 0){timeText = mimutes + '分钟前'}

        //计算相差秒数
        var levae3 = levae2%(60*1000);
        var seconds = Math.round(levae3/1000);
        if(seconds>=0 && mimutes == 0 && days == 0 && hours == 0){timeText = '刚刚'}

        return timeText;
    };
    //用于格式化时间(对话窗口)
    tool.formatDate = function(createDate){
        var timeInfo = {
            createDate: new Date(createDate)
        };
        var nowDate = new Date();
        var date1 = nowDate.getTime()-new Date(createDate).getTime();  //计算数据创建时间和现在时间的差
        var date2 = (nowDate.getTime())%(24*3600*1000);  //计算现在时间到早上零点的时间差
        var date3 = (new Date(createDate).getTime())%(24*3600*1000);
        if(date1 <= date2 ){         //说明该数据是今天创建的
            timeInfo.Date = '今天';
        }
        if(date1 > date2 && date1<= (date2+24*3600*1000)) {   //说明数据是昨天创建的
            timeInfo.Date = '昨天';
        }
            if(Math.floor(date3/(3600*1000)) <= 4){
                timeInfo.amPm = '上午';
            }else{
                timeInfo.amPm = '下午';
            }
        return timeInfo
    };

    //判断图片是否在加载中(参数 1.url： 图片加载路径2.callback：图片加载完成后执行的回调)
    tool.imgLoad = function(url, callback){
        //判断浏览器
        var Browser = new Object();
        Browser.userAgent = window.navigator.userAgent.toLowerCase();
        Browser.ie = /msie/.test(Browser.userAgent);
        Browser.Moz = /gecko/.test(Browser.userAgent);

        //判断是否加载完成
        var img = new Image();
        img.src = url;
        if(Browser.ie){
            img.onreadystatechange = function() {
                if (img.readyState == "complete" || img.readyState == "loaded") {
                    callback();
                }
            }
        }else if(Browser.Moz) {
            img.onload = function(){
                if(img.complete == true) {
                    callback();
                }
            }
        }
    };
    return tool;
});