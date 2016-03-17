/**
 * Created by zhaoyang
 */
angular.module('doFeedback', ['commonDirect', 'storage', 'ngDialog', 'service.mediaUpload','connectionAction'])
    .controller('doFeedbackCtrl', function ($scope, $http, $rootScope, Store, Common, ngDialog, $q, MediaUploadService) {
        //加载动画
        $scope.conWait = false;
        $scope.imgsrcList = [];
        //字数显示
        $scope.mynum = 0;
        //发送限度验证
        $scope.cansend = true;
        //输入判断函数
        $scope.limitMyFeed = function () {
            if ($scope.myFeedText.length > 200) {
                $scope.myFeedText = $scope.myFeedText.substr(0, 200);
            }
            if ($scope.myFeedText.length > 5) {
                $scope.cansend = false;
            } else {
                $scope.cansend = true;
            }
            $scope.mynum = $scope.myFeedText.length;
        };
        //请求后台地址
        $scope.httpurl = Common.baseURL + "/feedback/feedbacktosub";
        //获取本地的多媒体文件
        var imgUrl = "";
        $scope.getfile = function (num) {
            if (num == 0) {
                api.getPicture({
                    sourceType: 'library',
                    encodingType: 'jpg',
                    mediaValue: 'pic',
                    quality: 100,
                    saveToPhotoAlbum: false
                }, function (ret, err) {
                    if (ret) {
                        //判断是否选择了图片
                        if (ret.data != "") {
                            imgUrl = ret.data;
                            //图片压缩
                            var imageFilter = api.require("imageFilter");
                            var imgName = ret.data.lastIndexOf('/');
                            imgName = ret.data.substr(imgName + 1);
                            imageFilter.compress({
                                img: ret.data,
                                quality: 0.1,
                                scale: 0.5,
                                save: {
                                    album: false,
                                    imgPath: ret.data.substr(0, ret.data.lastIndexOf('/')),
                                    imgName: imgName
                                }
                            }, function (ret, err) {
                                //这里将取到的图片路径放入数组里面
                                if (err) {
                                    alert(err)
                                }
                                var imgKey = {
                                    mUrl: imgUrl,
                                    key: "",
                                    type: "pic"
                                };
                                $scope.imgsrcList.push(imgKey);
                                $scope.$apply();
                            });
                        }
                    } else {
                        alert(err.msg);
                    }
                });
            }
        };
        //删除图片
        $scope.removeImg = function (mindex) {
            $scope.imgsrcList.splice(mindex, 1);
        };
        //提交反馈
        $scope.feedBackSub = function () {
            $scope.conWait = true;
            //这里判断是否写入了文本信息
            var mytype;
            if ($scope.myFeedText.length > 0) {
                mytype = "text";
            } else {
                mytype = "";
            }
            $scope.feedInfo = {
                "type": mytype,
                "content": $scope.myFeedText,
                "fileList": $scope.imgsrcList
            };

            /**
             * 七牛存储图片,在提交的时候进行上传
             */
            //创建承诺数组集子项
            function putimg7n(num) {
                var deferred = $q.defer();
                MediaUploadService.upload($scope.imgsrcList[num].mUrl, "pic", function (err, ret) {
                    if (err) {
                        deferred.reject("上传失败了");
                    } else {
                        // 从七牛网返回的key作为data.content值
                        $scope.imgsrcList[num].key = ret.key;
                        //						alert(num + "||" + $scope.imgsrcList[num].key);
                        deferred.resolve(ret.key);
                    }
                });
                return deferred.promise;
            }

            //图片上传处理完成判断
            var allWaitImg = [];

            function putimgtolist() {
                for (var num = 0; num < $scope.imgsrcList.length; num++) {
                    allWaitImg.push(putimg7n(num));
                    if (num == $scope.imgsrcList.length - 1) {
                        return allWaitImg;
                    }
                }
            }

            //			这里判断是否插入了图片
            if ($scope.imgsrcList.length > 0) {
                $q.all(putimgtolist()).then(function (data) {
                    // 调用承诺API获取数据 .resolve
                    $http({
                        method: 'POST',
                        url: $scope.httpurl,
                        data: {
                            "feedInfo": $scope.feedInfo
                        }
                    }).success(function (data, status, headers, config) {
                        $scope.conWait = false;
                        alert("提交成功了~");
                        $scope.myfeedback();

                    }).error(function (data, status, headers, config) {
                        $scope.conWait = false;
                        alert("网络不给力~~提交失败了..╥﹏╥..");
                    });
                }, function (data) {
                    $scope.conWait = false;
                    // 处理错误 .reject
                    alert(data);
                });
            } else {
                $http({
                    method: 'POST',
                    url: $scope.httpurl,
                    data: {
                        "feedInfo": $scope.feedInfo
                    }
                }).success(function (data, status, headers, config) {
                    //						alert("提交成功了~");
                    $scope.conWait = false;
                    $scope.myfeedback();

                }).error(function (data, status, headers, config) {
                    $scope.conWait = false;
                    alert("网络不给力~~提交失败了..╥﹏╥..");
                });
            }
        };
        //点击打开反馈列表
        $scope.myFeedBackList = "feedback/myFeedback.tpl.html";
        $scope.myfeedback = function () {
            ngDialog.open({
                template: $scope.myFeedBackList,
                controller: "myFeedbackCtrl"
            });
        };


        //添加方法到apiready的公共方法中
        $scope.stateReady(function () {
            $scope.getfile(22);
        });
    });