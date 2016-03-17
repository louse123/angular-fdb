/**
 * Created by Administrator on 2015/8/11.
 */

var page=angular.module('directives.appScroll', [])

page.directive('frameScroll', function () {
    return {
        restrict: 'AE',
        scope:false,
        link: function(scope,element, attributes) {
            $('#f-container').bind('scroll', scrollEvent);

            function scrollEvent(){
                var scrollTop=$('#f-container')[0].scrollTop;  //滚过的高度
                var height=$('#f-container').height();         //滚动区域的高度
                var scrollHeight=$('#f-container')[0].scrollHeight;  //整个的高度
                if(scrollTop <= 0 &&  scope.scrollToTop){
                    scope.scrollToTop();
                }
                if(scrollHeight <= scrollTop + height &&  scope.scrollToButtom && scope.appendLength){
                    scope.scrollToButtom();
                    $('#f-container').unbind('scroll');
                        setTimeout(function(){
                            $('#f-container').bind('scroll', scrollEvent);
                        }, 500)
                }
            }
        }
    };
});

page.directive('windowScroll', function () {
    return {
        restrict: 'AE',
        link: function(scope,element, attributes) {
            element.scroll(function(){
                var scrollTop = element[0].scrollTop;
                var height = element.height();
                var scrollHeight = element[0].scrollHeight;
                if(scrollTop <= 0 && scope.wScrollToTop){
                    scope.wScrollToTop();
                }
                if(scrollTop + height >= scrollHeight && scope.wScrollToButtom){
                    scope.wScrollToButtom();
                }
            });
        }
    };
});
