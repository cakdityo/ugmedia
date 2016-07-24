(function(){

    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavNotifications', ugSidenavNotifications);

    function ugSidenavNotifications(){
        return {
            scope: {
                notifications: '='
            },
            templateUrl: 'src/layout/sidenavNotifications.html',
            controller: SidenavNotificationsController
        };

        function SidenavNotificationsController($scope){

        }
    }
})();