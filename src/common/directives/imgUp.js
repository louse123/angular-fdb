angular.module('directives.imgUp', []).directive('imgUp', function(){
    return{
        restrict: 'AE',
        link: function(scope,ele,attr){
            ele.bind('click', function(){
                var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var imgSrc = attr.src;
                var html = "<div id='imagePro'><div class='imgbox' style='width: 90%;height: 300px;position: absolute;left: 5%;top:100px;padding: 10px;z-index: 88;background-color:rgba(255,255,255,.9);border-radius: 10px;'>";
                html += " <img src='"+imgSrc.substr(0, attr.src.length - 5)+"' width='100%' height='100%'/>";
                html += "</div>";
                html +="<div class='shade'  style='width: "+ w +"px;height: "+ h +"px;z-index:55;position: absolute;top:0px;left:0px; background-color:rgba(238,236,236,.8)'>";
                html +="</div></div>";
                $(ele).parent().append(html);
                $('.shade').click(function(){
                    $(this).parent().remove();
                })
            });
        }
    }
});
