/**
 * Created by Administrator on 2015/9/10.
 */

/**
 * 增加指令b-chat-box，用于聊天框
 * 该指令可以为元素或者属性，使用时需要增加属性b-chat-box-data-handler，用于指定处理处理函数，仅写函数名字符串即可，
 * 函数签名：function(data, callback)方法
 * data： {type: string, content: Object}
 * callback：function(err)
 * 两个参数均为必须
 *
 * TODO 处理录音时手指滑动导致路因无法结束的问题
 * TODO enable emotion paging
 */
var chatBox = angular.module('directives.bChatBox',[]);

chatBox.directive('bChatBox', function () {
        /**
         * 获取所有表情图片的名称和真实url地址, 以JSON对像形式返回;其中以表情文本为 属性名, 以图片真实路径为属性值.
         * */
        function getEmotions(imgSourcePath, callback) {
            var jsonPath = imgSourcePath + 'emotion.json';
            api.readFile({
                path: jsonPath
            }, function (ret, err) {
                if (err || !ret.status) {
                    callback('fail to load emotion data' + err);
                    return;
                }
                var emotionArray = JSON.parse(ret.data);
                var emotion = {};
                for (var idx in emotionArray) {
                    var emotionItem = emotionArray[idx];
                    var emotionText = emotionItem["text"];
                    emotion[emotionText] = 'img/chat-box/emotion/' + emotionItem['name'] + ".png";
                }
                callback(undefined, emotion);
            });
        }

        /**
         *  将文字中的表情符号翻译成图片,并可自定义图片尺寸.
         *  */
        function transText(emotionData, text, imgWidth, imgHeight) {
            var width = imgWidth || 30;
            var height = imgHeight || 30;
            return text.replace(/\[(.*?)\]/gm, function (match) {
                var imgSrc = emotionData[match];
                if (!imgSrc) {/* 说明不对应任何表情,直接返回即可.*/
                    return match;
                }
                return '<img src="{0}" width="{1}" height="{2}" />'.format(imgSrc, width, height);
            });
        }

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'directives/chat-box.tpl.html',
            scope: true,
            controller: function ($scope, $element, $attrs) {
                var pushData = $scope[$attrs.bChatBoxDataHandler];
                $scope.textMode = true;
                $scope.text = '';
                $scope.stateReady(function () {
                    getEmotions('widget://img/chat-box/', function (err, data) {
                        if (err) console.log(err);
                        else {
                            $scope.emotionPageSize = api.winWidth / 38 * 4 - 1;
                            $scope.emotions = data;
                        }
                    });
                });
                $scope.toVoiceMode = function (voiceMode) {
                    $scope.textMode = !voiceMode;
                };
                $scope.showEmotion = false;
                $scope.toEmotionMode = function (showEmotion) {
                    $scope.showEmotion = showEmotion;
                };
                $scope.showMenu = false;
                $scope.openMenu = function () {
                    $scope.showMenu = true;
                };
                $scope.closeMenu = function () {
                    $scope.showMenu = false;
                };
                $scope.selectEmotion = function (emotion) {
                    $scope.text += emotion;
                };
                $scope.removeEmotion = function () {
                    $scope.text = $scope.text.substring(0, $scope.text.lastIndexOf('['));
                };

                this.startRecord = function () {
                    console.log('start record');
                    api.startRecord({
                        path: 'fs://' + new Date().getTime() + '.amr'
                    });
                };
                this.stopRecord = function () {
                    console.log('stop record');
                    api.stopRecord(function (ret, err) {
                        if (err) console.log(err);
                        else if (ret && ret.duration < 3) api.alert({msg: '您录制的声音太短了，多录一点吧~~~'});
                        else pushData({type: 'audio', content: ret.path}, function() { });
                    });
                };
                $scope.getMedia = function (type) {
                    $scope.closeMenu();
                    var mediaType = type ? 'video' : 'pic';
                    api.getPicture({
                        sourceType: 'camera',
                        mediaValue: mediaType,
                        encodingType: 'jpg',
                        quality: 100
                    }, function (data, err) {
                        if (err) console.log(err);
                        // 如果是相片，则进行预处理，即压缩图片
                        if(data.data != '' && $.trim(data.data).length > 0 && mediaType == 'pic'){
                            var imageFilter = api.require("imageFilter");
                            imageFilter.getAttr({path: data.data}, function(ret, err){
                                // 压缩图片
                                var index = data.data.lastIndexOf('/');
                                var imgPath = data.data.substr(0, index);
                                var imgName = data.data.substr(index + 1);
                                var compressParam = {
                                    img: data.data,
                                    quality: 1,
                                    save: {
                                        album: false,
                                        imgPath: imgPath,
                                        imgName: imgName
                                    }
                                };
                                var maxPix = ret.width > ret.height ? ret.width : ret.height;
                                // 如果分辨率大于1920,则进行缩放压缩,压缩为1920
                                if(maxPix > 1920){
                                    compressParam.scale = 1920/maxPix;
                                }
                                imageFilter.compress(compressParam, function(ret, err){
                                    pushData({type: mediaType, content: data.data}, function() { });
                                });
                            });
                        } else {pushData({type: mediaType, content: data.data}, function() { });}
                    });
                };
                $scope.sendText = function () {
                    pushData({type: 'text', content: transText($scope.emotions, $scope.text, 24, 24)}, function (err) {
                        if (err) console.log(err);
                        else {
                            $scope.text = '';
                            $($element).find('input').focus();
                        }
                    });
                };
                $scope.showSend = function () {
                    return $scope.text.length > 0;
                };
            }
        };
    });

/**
 * 控制录音的指令，继承于bChatBox指令，touchstart和touchend组成长按事件
 * */
chatBox.directive('hmPress', function() {
    return{
        restrict: 'AE',
        require: '^bChatBox',
        link: function(scope,element,attr,hmPressCtrl){
            var obj = document.getElementById('press-talk');
            obj.addEventListener('touchstart', function(event){
                event.preventDefault();
                $('#press-talk').addClass('b-btn-press');
                hmPressCtrl.startRecord();
            });
            obj.addEventListener('touchend', function(event){
                $('#press-talk').removeClass('b-btn-press');
                hmPressCtrl.stopRecord();
            })
        }
    }
});
