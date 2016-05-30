(function(){

    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavNotifications', ugSidenavNotifications);

    function ugSidenavNotifications(){
        return {
            templateUrl: 'src/layout/sidenavNotifications.html'
        };
    }
})();