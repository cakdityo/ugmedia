(function(){
    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavLeft', ugSidenavLeft);

    function ugSidenavLeft(){
        return {
            templateUrl: 'src/layout/sidenavLeft.html',
            controller: SidenavLeftController,
            controllerAs: 'sl'
        };

        function SidenavLeftController(){
            var sl = this;
        }
    }
})();