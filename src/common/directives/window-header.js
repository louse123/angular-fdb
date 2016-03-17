/**
 * Created by Administrator on 2015/8/11.
 */

var page=angular.module('directives.bWindowHeader', [])

page.directive('bWindowHeader', function() {
    return {
        restrict: 'A',
        replace : true,
        link: function(scope, element, attrs) {
            if (attrs.bWindowHeader && attrs.bWindowHeader.length > 0) {
                $(element).prepend('<p class="text-center" style="display: initial">' + attrs.bWindowHeader + '</p>');
            }
            var leftContainer = $('<div class="b-icon-container-left"></div>');
            var closeBtn = $('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>');
            leftContainer.append(closeBtn);
            $(element).prepend(leftContainer);
            $(closeBtn).click(function () {
                scope.closeThisDialog(0);
            });
            $(element).addClass('b-header');
        }
    };
});