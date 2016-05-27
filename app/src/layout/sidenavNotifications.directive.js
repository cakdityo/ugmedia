(function(){

    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavNotifications', ugSidenavNotifications);

    function ugSidenavNotifications(){
        return {
            templateUrl: 'src/layout/sidenavNotifications.html',
            controller: SidenavNotificationsController,
            controllerAs: 'sn'
        };

        function SidenavNotificationsController(){
            var vm = this;

            vm.tes = "hello cak!";
        }
    }
})();