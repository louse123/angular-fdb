var page4 = angular.module('feedbackTalk', ['directives.ac', "commonDirect", 'service.mediaUpload', 'storage', 'pushService']);
page4.controller('feedbacktalkCtr', function ($scope, $http, $sce, Common, MediaUploadService, Store, PushService) {
    //初始化从列表那里得来的数据
    $scope.refresh = function () {
        $scope.allFeedInfo = $scope.feedbackTalkUse;
        $scope.Myuser = $scope.allFeedInfo.user;
    };
    //定义一个时间比较的参数
    $scope.compareTime;
    //更新反馈数据    (需要重新调整)  这里是文字数据
    $scope.refresh();

    $scope.imeurl7bef = "http://media.fudaobang.cn/";
    $scope.userImgUrl = Common.downLoadBaseURL + "" + Store.getStorage('user').user.headPic.key;
    $scope.AdminImgUrl = "img/feedback/myheadImg.jpg";
    $scope.mycompar = {
        "beforeTime": 0
    };
    //只有用户输入了以后才会去对比时间,对比的判定为chose为true
    $scope.timechose = {
        "chose": false
    };
    //表情使用
    $scope.facetext = false;
    //缩略图语句
    $scope.mthumbanil = "?imageView2/0/w/200;";
    //推送监听
    $scope.initEvent = function () {
        PushService.init();
        // 监听推送过来的对话消息
        PushService.addListener(function (msg) {
            //alert('listen: ' + JSON.stringify(msg));
            var extra = msg.extra;
            if (extra.type == 'FEEDBACK_ANSWER' && extra.feedbackId == $scope.allFeedInfo._id) {
                var myNewContent = extra.data;
                myNewContent["updateTime"]=extra.time;
                $scope.allFeedInfo.content.push(extra.data);
            }
            $scope.$apply();
        });
    };
    //这里是下方输入功能条开始
    $scope.pushChatData = function (data) {
        if (data.type == "text" && data.content != "") {
            //这里是日期 需要调整  -----------------------日期----------------------------------
            data.updateTime = new Date();
            data.user = Store.getStorage('user').user._id;
            //日期的调整---------------------------日期-------------------------------------
            var nowList = $scope.allFeedInfo.content;
            nowList.push(data);
            $scope.allFeedInfo.content = nowList;
            var mytype = "text";
            $scope.feedInfo = {
                "feedbackId": $scope.allFeedInfo._id,
                "type": mytype,
                "content": data.content
            };
            //请求后台地址
            $scope.httpurl = Common.baseURL + '/feedback/feedbacktotalk';
            $http({
                method: 'POST',
                url: $scope.httpurl,
                data: {
                    "feedInfo": $scope.feedInfo
                }
            }).success(function (data, status, headers, config) {

            }).error(function (data, status, headers, config) {
                alert("网络不给力~~提交失败了..╥﹏╥..");
            });
        }


        //更新媒体数据
        if (data.type == 'pic' || data.type == 'audio' || data.type == 'video') {

            if (data.type == 'pic') {
                //图片压缩
                var imageFilter = api.require("imageFilter");
                var imgName = data.content.lastIndexOf('/');
                imgName = data.content.substr(imgName + 1);
                imageFilter.compress({
                    img: data.content,
                    quality: 0.1,
                    scale: 0.5,
                    save: {
                        album: false,
                        imgPath: data.content.substr(0, data.content.lastIndexOf('/')),
                        imgName: imgName
                    }
                }, function (ret, err) {
                    picAudioSend();
                });
            } else {
                if (data.type == "video") {
                    picAudioSend()
                }
            }

            function picAudioSend() {
                // ---------------------日期------------------------------
                data.updateTime = new Date();
                //------------------日期问题结束------------------------------
                var nowList = $scope.allFeedInfo.content;
                var newdata = {};
                newdata['key'] = data.content;
                newdata['filetrue'] = true;
                newdata['updateTime'] = data.updateTime;
                newdata['user'] = Store.getStorage('user').user._id;
                newdata['type'] = data.type;
                nowList.push(newdata);
                $scope.allFeedInfo.content = nowList;
                MediaUploadService.upload(data.content, data.type, function (err, ret) {
                    if (err) {
                        alert("上传媒体数据失败了/(ㄒoㄒ)/~~" + err);
                    } else {
                        var mytype = data.type;
                        $scope.feedInfo = {
                            "feedbackId": $scope.allFeedInfo._id,
                            "file_type": mytype,
                            "file_key": ret.key,
                            "file_name": data.content
                        };
                        //请求后台地址
                        $scope.httpurl = Common.baseURL + '/feedback/feedbacktotalk';
                        $http({
                            method: 'POST',
                            url: $scope.httpurl,
                            data: {
                                "feedInfo": $scope.feedInfo
                            }
                        }).success(function (data, status, headers, config) {
                            alert("提交成功了~");
                        }).error(function (data, status, headers, config) {
                            alert("网络不给力~~提交失败了..╥﹏╥..");
                        });
                    }
                });
            }

        }
    };

    $scope.myTextFace = function (mycontent) {
        return $sce.trustAsHtml(mycontent);
    };

    $scope.showPic = "";

    $scope.picClose = function () {
        $('#myPic').modal('hide');
    };

    $scope.showPicFun = function (picurl) {
        $scope.showPic = picurl;
        $('#myPic').modal('show');
    };

    $scope.showVideo = function (videourl) {
        api.openVideo({
            url: videourl
        });
    };

    //添加方法到apiready的公共方法中
    $scope.stateReady(function () {
        $scope.showVideo();
        $scope.initEvent();
    });

});
page4.filter("Cimg", function () {
    return function (input, userId) {
        if (input == userId) {
            return true;
        } else {
            return false;
        }
    }
});
page4.filter("CWTime", function () {
    return function (input, allList, index) {
        //返回值设定
        var sendValue = {};
        //获取系统时间
        var myNowDate = new Date();
        //获取当前输入时间
        var justBefore = input;
        if (input instanceof Date) {
        } else {
            justBefore = setmyTime(justBefore);
        }
        //得到时间戳,精确到秒
        var justBeforeNum = Date.parse(justBefore) / 1000;
        //获取上一个对话的事件
        if (index > 0) {
            if (allList[index - 1].updateTime instanceof Date) {
            } else {
                allList[index - 1].updateTime = setmyTime(allList[index - 1].updateTime);
            }
            var justComparetime = Date.parse(allList[index - 1].updateTime) / 1000;
            //时差在3分钟以内
            if ((justBeforeNum - justComparetime) / 60 < 3) {
                sendValue["mytime"] = "";
                sendValue["choose"] = false;
                return sendValue;
            } else {
                if (justBefore.getDate() == myNowDate.getDate()) {
                    var tt = justBefore.toLocaleTimeString();
                    tt = "今天	" + tt;
                    sendValue["mytime"] = tt;
                    sendValue["choose"] = true;
                    return sendValue;
                } else {
                    var ff = justBefore.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                    sendValue["mytime"] = ff;
                    sendValue["choose"] = true;
                    return sendValue;
                }
            }
        } else {
            var ff = justBefore.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            sendValue["mytime"] = ff;
            sendValue["choose"] = true;
            return sendValue;
        }

        function setmyTime(mytime) {
            var date = new Date();
            date.setFullYear(mytime.substring(0, 4));
            date.setMonth(mytime.substring(5, 7) - 1);
            date.setDate(mytime.substring(8, 10));
            date.setHours(mytime.substring(11, 13));
            date.setMinutes(mytime.substring(14, 16));
            date.setSeconds(mytime.substring(17, 19));
            return date;
        }
    }
});
page4.filter("ShowTime", function () {
    return function (input, allList, index) {
        //返回值设定
        var sendValue = {};
        //获取系统时间
        var myNowDate = new Date();
        //获取当前输入时间
        var justBefore = input;
        if (input instanceof Date) {
        } else {
            justBefore = setmyTime(justBefore);
        }
        //得到时间戳,精确到秒
        var justBeforeNum = Date.parse(justBefore) / 1000;
        //获取上一个对话的事件
        if (index > 0) {
            if (allList[index - 1].updateTime instanceof Date) {
            } else {
                allList[index - 1].updateTime = setmyTime(allList[index - 1].updateTime);
            }
            var justComparetime = Date.parse(allList[index - 1].updateTime) / 1000;
            //时差在3分钟以内
            if ((justBeforeNum - justComparetime) / 60 < 3) {

                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

        function setmyTime(mytime) {
            var date = new Date();
            date.setFullYear(mytime.substring(0, 4));
            date.setMonth(mytime.substring(5, 7) - 1);
            date.setDate(mytime.substring(8, 10));
            date.setHours(mytime.substring(11, 13));
            date.setMinutes(mytime.substring(14, 16));
            date.setSeconds(mytime.substring(17, 19));
            return date;
        }
    }
});
