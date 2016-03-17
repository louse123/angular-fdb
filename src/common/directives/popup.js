/**
 * 该文件所有指令用于创建弹窗
 * */

var popup = angular.module('directive.popup',['commonPopup', 'tool']);
//问题发布弹窗
popup.directive('publish', function(popup, $templateCache){
    return{
        restrict: 'A',
        link: function(scope, elem, attr){
            elem.bind('click', function(){
                if(scope.questionData.content.length === 0 || !scope.questionData.subject || scope.questionData.subject ===""){
                    $('.container').append(popup.shadeString);
                    $('.b-shade').append($templateCache.get('popup/lack-description.tpl.html'));
                    $("#exec").click(function(){
                        $('.b-shade').remove();
                    })
                }else if(scope.questionData.coin){
                    $('.container').append(popup.shadeString);
                    $('.b-shade').append($templateCache.get('popup/question-publish.tpl.html'));
                    $('#coinVal').html(scope.questionData.coin+'金币');
                    $("#exec").click(function(){
                        $('.b-shade').remove();
                    });
                    $("#publish").click(function(){
                        scope.$apply('publish()')
                    });
                }
            })
        }

    }
});

//问题分享弹窗
popup.directive('questionShare', function(popup, $templateCache){
    return{
        restrict: 'A',
        link: function(scope, elem, attr){
            elem.bind('click', function(){
                $('.btn-group').removeClass('open');
                $('.container').append(popup.shadeString);
                $('.b-shade').append($templateCache.get('popup/question-share.tpl.html'));
                $('#exec-share').click(function(){
                    $('.b-shade').remove();
                });
            });
        }
    }
});

//问题、回答举报弹窗
popup.directive('report', function(popup, $templateCache){
    return{
        restrict: 'A',
        link: function(scope, elem, attr){
            elem.bind('click', function(){
                $('.btn-group').removeClass('open');
                $('.container').append(popup.shadeString);
                $('.b-shade').append($templateCache.get('popup/question-report.tpl.html'));
                $('.exec-report').click(function(){
                    $('.b-shade').remove();
                });
                $('.report').click(function(){
                    scope.report();
                });
            });
        }
    }
});

//增加悬赏弹窗
popup.directive('raiseCoin', function(popup, $templateCache){
    return{
        restrict: 'A',
        link: function(scope, elem, attr){
            elem.bind('click', function(){
                if(scope.question.isAddGold){
                    alert('你已经增加过一次悬赏金币数量了，机会只有一次哦！')
                }else{
                    $('.container').append(popup.shadeString);
                    $('.b-shade').append($templateCache.get('popup/add-coin.tpl.html'));
                    $('#close_raise').click(function(){
                        $('.b-shade').remove();
                    });
                    $('.minusCoin').click(function() {   //减金币
                        var coin = $('#coinVal').val();
                        if(isNaN(coin)){
                            alert('悬赏金币需为数字');
                            return;
                        }
                         coin = parseInt(coin) - 5;
                        $('#coinVal').val(coin > 0 ? coin : 5)
                    });
                    $('.addCoin').click(function() {    //加金币
                        var coin = $('#coinVal').val();
                        if(isNaN(coin)){
                            alert('悬赏金币需为数字')
                            return;
                        }
                        $('#coinVal').val( parseInt(coin) + 5);
                    });
                    $('#addGold').click(function(){
                        var coin = $('#coinVal').val();
                        if(isNaN(coin)){
                            alert('悬赏金币需为数字');
                            return;
                        }
                        coin = parseInt(coin);
                        if(coin <= 0){
                            alert('提高的赏金需大于0');
                            return;
                        }
                        var inputQuery = {};
                        inputQuery.newNum = scope.question.coin + $('#coinVal').val();
                        inputQuery.questionId =  scope.question._id;
                        scope.addGold(inputQuery);
                        $('.b-shade').remove();
                        scope.closeThisDialog(0);
                    });
                }
            })
        }
    }
});

//回答采纳弹窗(提问者从问题详情中采纳)
popup.directive('answerAdopt', function(popup, $templateCache){
    return{
        restrict: 'A',
        link: function(scope, elem, attr){
            $('.container').append(popup.shadeString);
            $('.b-shade').append($templateCache.get('popup/adopt-detail.tpl.html'));
            $('#close_adopt').click(function(){
                scope.adopt();
                $('.b-shade').remove();
            });
        }
    }
});

//回答采纳弹出层(提问者从回答详情聊天对话中采纳)
popup.directive('chatAdopt', function(popup,$timeout){
   return{
       restrict: 'A',
       link: function(scope, elem, attr){
           $('.container').append(popup.shadeString);
           $('.b-shade').append("<img style='margin-top: 30%'src='img/0911-xh128.png' width='90%' height='50%'/></div>");
           $timeout(function(){
               scope.adopt();
               $('.answer-adopt').remove();
           }, 4000)
       }
   }
});

//取消问题弹窗
popup.directive('escQuestion', function(popup, $templateCache){
    return{
        restrict: 'A',
        link:function(scope, elem, attr){
            elem.bind('click', function(){
                $('.container').append(popup.shadeString);
                $('.b-shade').append($templateCache.get('popup/esc-question.tpl.html'));
                $('#close_quxiao').click(function(){
                    $('.b-shade').remove();
                });
                $('#esc-question').click(function(){
                    if(confirm('你确定要取消这个问题？')){
                        scope.cancel();
                    }
                })
            });
        }
    }
});

//图片放大预览
popup.directive('imgUp', function(popup, Tool){
    return{
        restrict: 'A',
        link: function(scope,ele,attr){
            ele.bind('click', function(){
                var imgSrc = attr.ngSrc.substr(0, attr.ngSrc.length - 5);
                var html = "<div id='imagePro'><div class='imgbox img-loading' style='width: 90%;height: 300px;position: absolute;left: 5%;top:100px;padding: 10px;overflow:visible; z-index: 88;background-color:rgba(255,255,255,.9);border-radius: 10px;'>";
                html += "<div class='load-img' style=';position: absolute;top:0;left:0;z-index: 85;width: 100%;height: 100%;background: url(img/loading.gif) center no-repeat;background-size:25px 25px'></div>";
                html += "<img src='"+imgSrc+"' width='100%' height='100%'/>";
                html += "</div>";
                html +="<div class='shade'  style='width: "+ popup.w +"px;height: "+ popup.h +"px;z-index:55;position: absolute;top:40px;left:0; background-color:rgba(238,236,236,.8)'>";
                html +="</div></div>";
                $(ele).parent().append(html);
                //判断图片是否已经加载完成
                Tool.imgLoad(imgSrc,function(){
                    $('.load-img').remove();
                });
                $('.shade').click(function(){
                    $('#imagePro').remove();
                });
            });
        }
    }
});


