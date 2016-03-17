/**
 * Created by bean on 2015/7/8.
 */
var page = angular.module("pushService", ['commonDirect','messageDao']);
page.service("PushService", function ($rootScope, $http, Common,MessageDao) {
    var url = Common.baseURL;
    $rootScope.messageList=new Array();
    this.init = function (callback) {
        var ajpush = api.require('ajpush');
        if (!ajpush) {
            return;
        }
        ajpush.init(function (ret) {
            if (ret && ret.status) {
                // 获取推送客户端注册ID并发送给服务器存储，与用户绑定
                ajpush.getRegistrationId(function (ret) {
                    var registrationId = ret.id;
                    console.log('push-service.js ----- get RegistrationId!');
                    // 获取当前用户并将客户端注册ID与用户绑定
                    $http.post(url + '/push/register', {client: registrationId}).success(function(){
                        var data = MessageDao.initMessage();
                        data.then(function(result) {
                            var data = MessageDao.findMessage();
                            data.then(function(result) {
                                $rootScope.messageList=result;
                            }, function(result) {
                                alert(JSON.stringify(result)+"error!");
                            });
                        }, function(result) {
                            alert("本地数据库出现异常" + result);
                        });
                    });
                    console.log(registrationId);
                });
            }
        });
    }

    this.addListener = function (callback) {
        var ajpush = api.require('ajpush');
        if (!ajpush) {
            return;
        }
        // 处理消息，消息仅在应用处于运行状态时可以进行处理
        ajpush.setListener(
            function (result) {
                console.log('Listener: 2');
                dealMessage(result, callback);
            }
        );
        // 在Android平台，使用极光推送发送通知、消息等类型推送时，
        // 极光推送模块会往设备状态栏上发送通知，当通知被点击后，
        // APICloud会将本次推送的内容通过事件监听回调的方式交给开发者
        api.addEventListener({name: 'appintent'}, function (ret, err) {
            if (ret && ret.appParam.ajpush) {
                console.log('AndriodListener: 1');
                dealMessageAndNotification(ret.appParam.ajpush, callback);
            }
        });
        // 在iOS平台，当应用在后台时，使用极光推送发送通知时（消息只有应用在前台才能收到），系统会往设备发送通知。
        // 当通知被点击后，若应用已启动，则通过上面的setListener回调给开发者；
        // 若应用未启动， APICloud会将本次推送的内容通过事件监听回调的方式交给开发者。
        // 具体使用如下：
        api.addEventListener({name: 'noticeclicked'}, function (ret, err) {
            console.log('IOSListener: 1');
            if (ret && ret.value) {
                this.dealMessageAndNotification(ret.value, callback);
            }
        });

        /**
         * 处理推送的消息，仅在应用处于前台（运行状态）时执行，用于进行红点显示和本地数据存储
         * @param msg 推送的消息，id、content、title、extra（消息自定义json）
         */
        function dealMessage(result, callback) {
            var id = result.id;
            var title = result.title;
            var content = result.content;
            result.extra= JSON.parse(result.extra);
            var isExist=true;
            var message={};
            message.type=result.extra.type;
            if(message.type=='QUESTION_ANSWER'){
                message.content=result.extra.data.content;
                message.contentType=result.extra.data.type;
                message.time=result.extra.data.time;
                message.fromUserId=result.extra.data.user._id;
                message.fromUserName=result.extra.data.user.nickname;
                message.fromUserPic=result.extra.data.user.headPic.key;
                message.answerId=result.extra.answerId;
                for(var i=0;i<$rootScope.messageList.length;i++){
                    if($rootScope.messageList[i].answerId== message.answerId){
                        $rootScope.messageList[i]=message;
                        isExist=false;
                        if(!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                        //更新数据库最新消息
                        MessageDao.updateMessage(message,'answerId',message.answerId);
                    }
                }
            }
            if(result.type=='MONITOR_VOTE_FIRST'){
                message.content=result.content;
                message.monitorId=result.extra.monitorVote;
                message.time=result.extra.time;
                for(var i=0;i<$rootScope.messageList.length;i++){
                    if($rootScope.messageList[i].monitorId== message.monitorId){
                        $rootScope.messageList[i]=message;
                        isExist=false;
                        if(!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                        //更新数据库最新消息
                        MessageDao.updateMessage(message,'monitorId',message.monitorId);

                    }
                }
            }
            if(result.type=='MONITOR_VOTE_RESULT'){
                message.content=result.content;
                message.monitorId=result.extra.monitorVote;
                message.time=result.extra.time;
                for(var i=0;i<$rootScope.messageList.length;i++){
                    if($rootScope.messageList[i].extra.monitorId==result.monitorId){
                        $rootScope.messageList[i]=message;
                        isExist=false;
                        if(!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                        //更新数据库最新消息
                        MessageDao.updateMessage(message,'monitorId',message.monitorId);
                    }
                }
            }
            if(isExist){
                $rootScope.messageList.push(message);
                if(!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                //添加新消息到本地数据库
                MessageDao.addMessage(message);
            }
            callback(result);
        }

        /**
         * 处理通知，在用户点击推送的消息或者通知时执行，消息仅对Android有效
         * @param msg 推送的消息，id、content、title、extra（消息自定义json）
         */
        function dealMessageAndNotification(result, callback) {
            console.log('push-service.js ----- Deal Message And Notification When user click!');
            var id = result.id;
            var title = result.title;
            var content = result.content;
            var extra = JSON.parse(result.extra);
            console.log(JSON.stringify(result));
            $rootScope.messageList.push(result);
            callback(result);
        }
    }

});