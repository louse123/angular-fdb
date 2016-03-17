/**
 * Created by Administrator on 2015/8/11.
 */

var page=angular.module('directives.mediaUpload', ['commonDirect','storage','service.mediaUpload'])

page.directive('mediaUpload', function(Store,MediaUploadService,Common) {
    return {
        restrict : 'AE',
        link : function(scope, element, attributes,http) {
            element.bind('click', function() {
                var type= attributes.type //pic 图片  video视频 all图片和视频
                api.actionSheet({
                    cancelTitle : '取消',
                    buttons : ['拍照', '相册']
                }, function(ret, err) {
                    var source = ret.buttonIndex == 1 ? 'camera' : 'album'
                    api.getPicture({
                        sourceType: source,
                        mediaValue: type,
                        encodingType: 'jpg',
                        targetWidth: attributes.width,
                        targetHeight: attributes.height,
                        quality:100,
                        saveToPhotoAlbum: true
                    }, function (ret, err) {
                        if (err) {
                            alert("服务器出现故障，有稍后再试！");
                        } else {
                            if(ret.data==""||ret.data==undefined){
                                return;
                            }
                            MediaUploadService.upload(ret.data, type, function(err, ret) {
                                if (err) {
                                    alert("服务器出现故障，有稍后再试！");
                                } else {
                                    // 从七牛网返回的key作为data.content值
                                    var content = ret.key;
                                    var obj = api.require('fs');
                                    obj.exist({
                                        path :api.fsDir + '/res/'+content
                                    }, function(ret, err) {
                                        if (ret.exist) {
                                            alert("exist!");
                                        } else {
                                            api.download({
                                                url : Common.downLoadBaseURL + content,
                                                savePath : 'fs://res/' + content,
                                                report : true,
                                                cache : true,
                                                allowResume : true
                                            }, function(ret, err) {
                                                if (ret.state==1) {
                                                    scope.downLoadImgUrl= api.fsDir + '/res/' + content;
                                                    if(!scope.$$phase) {
                                                        scope.$apply();
                                                    }
                                                    var json={};
                                                    json.key=content;
                                                    json.type=type
                                                    json.name=content;
                                                    json.size=ret.fileSize;
                                                    //上传到数据库
                                                    Common.saveFile(json);
                                                } else {
                                                    var value = err.msg;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
    }
});