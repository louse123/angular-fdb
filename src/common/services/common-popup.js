var page = angular.module('commonPopup',[]);

page.factory('popup', function(){
    var popup = {};
    popup.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //窗口宽度
    popup.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口高度
    popup.shadeString = "<div class='b-shade' style=' width:"+ popup.w +"px;height: "+ popup.h +"px;position: absolute;top: 0;left: 0;z-index: 900;background-color:rgba(148,148,148,.7)'></div>"; //最外层遮罩层
    return popup;
});

