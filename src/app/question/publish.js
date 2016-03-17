var questionPublish = angular.module('question.publish',['service.mediaUpload', 'problemService', 'commonDirect', 'directives.ac', 'ngDialog', 'security']);

questionPublish.controller('PublishCtrl', function($rootScope, $scope, $http , $sce, MediaUploadService, ProblemService, Common,ngDialog, SecurityService){
    // 判断用户是否登录，没登录时则让其等才能进入发布问题,这是为了避免发送照片上传七牛时需验证登录而导致上传图片不成功
    if(!SecurityService.authed()){
        $rootScope.$broadcast('auth:loginRequired');
    }

    $scope.questionData = {
        coin : 10,
        content : []
    };

    // 获取科目列表
    $scope.categories = [];
    // TODO 获取当前用户的年级
    var grade = '4';
    ProblemService.listSubject(grade).success(function(data) {
        var subjects = data.subjects;
        $.each(subjects, function(index, v) {
            $scope.categories.push(v);
        });
        $scope.questionData.subject = data.subjects[0];
    });

    var changeNum = 5;
    $scope.minusCoin = function() {
        if(isNaN($scope.questionData.coin)){
            api.alert({
                msg : '悬赏金币需为数字'
            }, function(ret, err) {
                //coding...
            });
            return;
        }
        var coin = parseInt($scope.questionData.coin) - changeNum;
        if (coin < changeNum) {
            coin = changeNum;
        }
        $scope.questionData.coin = coin;
    };

    $scope.addCoin = function() {
        if(isNaN($scope.questionData.coin)){
            api.alert({
                msg : '悬赏金币需为数字'
            }, function(ret, err) {
                //coding...
            });
            return;
        }
        $scope.questionData.coin = parseInt($scope.questionData.coin) + changeNum;
    };

    $scope.pushChatData = function(data) {
        if(data != '' && $.trim(data.content).length > 0){
            if (!$scope.questionData.content) {
                $scope.questionData.content = [];
            }
            // 当内容是文件时上传到七牛网
            if (data.type === 'pic' || data.type === 'audio' || data.type === 'video') {
                MediaUploadService.upload(data.content, data.type, function(err, ret) {
                    if (err) {
                        console.log('PushDataERR: ' + err);
                    } else {
                        console.log('PushData: ' + JSON.stringify(ret));
                        // 从七牛网返回的key作为data.content值
                        data.file = ret.key;
                    }
                });
            }
            $scope.questionData.content.push(data);
        }
    };
    $scope.toHtml = function(text) {
        return $sce.trustAsHtml(text);
    };
    $scope.playAudio = function(path) {
        api.startPlay({
            path : path
        }, function() {

        });
    };
    $scope.playVideo = function(path) {
        api.openVideo({
            url : path
        });
    };
    $scope.publish = function() {
        if(isNaN($scope.questionData.coin)){
            api.alert({
                msg : '悬赏金币需为数字'
            }, function(ret, err) {
                //coding...
            });
            return;
        }
        if($scope.questionData.coin < 5){
            api.alert({
                msg : '悬赏金币不能低于5'
            }, function(ret, err) {
                //coding...
            });
            return;
        }
        api.confirm({
            msg : '确认发布将扣取' + $scope.questionData.coin + '个金币'
        }, function(ret, err) {
            if (ret.buttonIndex == 2) {
                if($scope.questionData.content.length == 0){
                    api.alert({
                        msg : '问题内容不能为空'
                    }, function(ret, err) {
                        //coding...
                    });
                    return;
                }
                // 点击确定按钮进行发布问题
                ProblemService.publish($scope.questionData).success(function(data) {
                    if (data.rescode == 0) {
                        // 跳转到详情页面
                        $scope.closeThisDialog(0);
                        ngDialog.open({
                            template:"question/detail.tpl.html",
                            controller:'detailCtrl',
                            data:{questionId:data.question._id}
                        });
                    } else if (userToken == null) {
                        $scope.openWin("login", "../../login.html");
                        // TODO 用户没登录，跳转到登录页面
                    } else if (data.rescode == 300001) {
                        api.alert({
                            msg : '金币不足'
                        }, function(ret, err) {
                            //coding...
                        });
                        // TODO 金币数不足，提示修改悬赏或去充值
                    } else if (data.rescode == 100005) {
                        api.alert({
                            msg : '数据格式错误'
                        }, function(ret, err) {
                            //coding...
                        });
                    } else if(data.rescode == 300002){
                        api.alert({
                            msg : '请先完善资料，才能进行此项操作'
                        }, function(ret, err) {
                            // TODO 跳转到完善资料页面
                        });
                    }
                });
            }
        });
    };
});
