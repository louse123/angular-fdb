/**
 * Created by libin on 2015/6/3.
 */

angular.module('directives.ac', ['directives.ac.chatbox']);


/**
 * 定义指令chatbox，使用自定义标签chatbox
 *
 * 该指令需要调用父scope中的pushChatData(data, callback)方法
 * data： {type: string, content: Object}
 * callback：function(err)
 * */
angular.module('directives.ac.chatbox', [])
    // 表情图标目录常量
    .constant('EMOTION_SOURCE', 'widget://img/chatBox/emotion')
    .constant('CHATBOX_IMG_ROOT', 'widget://img/chatBox/')
    .directive('chatbox', function (EMOTION_SOURCE, CHATBOX_IMG_ROOT) {
        return {
            restrict: 'E',
            transclude: true,
            link: function (scope) {
                scope.stateReady(function () {
                    var chatBox = api.require('chatBox');
                    var emotionData;
                    /* 存储表情信息: JSON对象,以 表情字符 为属性名, 以 表情图片URL 为值.*/
                    getImgsPaths(EMOTION_SOURCE, function (emotion) {
                        emotionData = emotion;
                    });
                    chatBox.open({
                        leftButton: {
                            normal: CHATBOX_IMG_ROOT + 'face1.png',
                            selected: CHATBOX_IMG_ROOT + 'key2.png'
                        },
                        switchButton: {
                            faceNormal: CHATBOX_IMG_ROOT + 'face1.png',
                            faceHighlight: CHATBOX_IMG_ROOT + 'face2.png',
                            addNormal: CHATBOX_IMG_ROOT + 'add1.png',
                            addHighlight: CHATBOX_IMG_ROOT + 'add2.png',
                            keyboardNormal: CHATBOX_IMG_ROOT + 'key1.png',
                            keyboardHighlight: CHATBOX_IMG_ROOT + 'key2.png'
                        },
                        sourcePath: EMOTION_SOURCE,
                        addButtons: [{
                            normal: CHATBOX_IMG_ROOT + 'cam1.png',
                            highlight: CHATBOX_IMG_ROOT + 'cam2.png',
                            title: "图片"
                        }, {
                            normal: CHATBOX_IMG_ROOT + 'loc1.png',
                            highlight: CHATBOX_IMG_ROOT + 'loc2.png',
                            title: "视频"
                        }]
                    }, function (ret, err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        /* 此回调会在两种情况下触发:
                         * 1. 用户输入文字或表情
                         * 2. 用户 点击了 添加界面 的自定义按钮.
                         */
                        /* 用户点击了 添加界面的 自定义按钮. */
                        if (ret["click"]) {
                            /* 用户点击 相机 或者视频 图标 */
                            var type = ret.index === 0 ? 'pic' : 'video';
                            getMediaFromCamera(type, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    scope.pushChatData({
                                        type: type,
                                        content: data.data
                                    });
                                }
                            });
                        } else {
                            var sendMsg = transText(emotionData, ret.msg);
                            scope.pushChatData({
                                type: 'text',
                                content: sendMsg
                            });
                        }
                    });

                    chatBox.setRecordButtonListener(function (evt, err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        switch (evt.eventType) {
                            case 'touch_in':
                                api.startRecord({
                                    path: 'fs://' + new Date().getTime() + '.amr'
                                });
                                break;
                            case 'touch_cancel':
                                api.stopRecord(function (ret, err) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (ret && ret.duration < 3) {
                                        api.alert({msg: '您录制的声音太短了，多录一点吧~~~'});
                                        return;
                                    }
                                    scope.pushChatData({
                                        type: 'audio',
                                        content: ret.path
                                    });
                                });
                                break;
                        }
                    });
                });
                /* 将文字中的表情符号翻译成图片,并可自定义图片尺寸. */
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

                /**
                 * 获取所有表情图片的名称和真实url地址, 以JSON对像形式返回;其中以表情文本为 属性名, 以图片真实路径为属性值.
                 * */
                function getImgsPaths(sourcePathOfChatBox, callback) {
                    var jsonPath = sourcePathOfChatBox + ".json";
                    api.readFile({
                        path: jsonPath
                    }, function (ret, err) {
                        if (ret.status) {
                            var emotionArray = JSON.parse(ret.data);
                            var emotion = {};
                            for (var idx in emotionArray) {
                                var emotionItem = emotionArray[idx];
                                var emotionText = emotionItem["text"];
                                emotion[emotionText] = api.wgtRootDir + "/img/chatBox/emotion/" + emotionItem["name"] + ".png";
                            }
                            /* 把 emotion对象 回调出去. */
                            if ("function" === typeof (callback)) {
                                callback(emotion);
                            }
                        }
                    });
                }

                /**
                 * 从用户相机获取照片或者视频
                 * type: 0照片，1视频
                 *
                 * callback： function(err, data), data: {  }
                 * */
                function getMediaFromCamera(type, callback) {
                    api.getPicture({
                        sourceType: 'camera',
                        mediaValue: type,
                        encodingType: 'jpg',
                        quality: 100
                    }, function (ret, err) {
                        callback(err, ret);
                    });
                }
            }
        };
    });