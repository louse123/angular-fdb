var page = angular.module("message-info", ['commonDirect','directives','messageDao','security','pushService']);
page.controller("messageInfoController", function($rootScope, $scope, $http, Common,MessageDao,SecurityService,PushService) {

    $scope.init=function(){
        $("#f-container").unbind();
        $("#f-container").scroll(function(){
            var scrollTop=$("#f-container")[0].scrollTop;  //滚过的高度
            var height=$("#f-container").height();         //滚动区域的高度
            var scrollHeight=$("#f-container")[0].scrollHeight;  //整个的高度
            if(scrollTop<=0){
                $("#loading").slideDown();
                var timer = setTimeout(function() {
                    clearTimeout(timer);
                    $("#loading").slideUp();
                }, 2000);
            }
        });
    }
    $scope.init();

    $scope.openDialog=function(template,controller){
        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
    }

    $scope.test=function(){
        $http.post(Common.baseURL + "/question/answer", {}).success(function(result) {
            alert("发送推送");
        });
    }

    //历史推送数据
    $scope.stateReady(function() {
        //初始化推送监听
        PushService.init();
        //创建监听
        PushService.addListener();
    });

});

