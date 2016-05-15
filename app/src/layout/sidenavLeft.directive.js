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

        function SidenavLeftController($firebaseAuthService, $state){
            var vm = this;

            vm.logout = logout;
            vm.navigateTo = navigateTo;

            function logout(){
                $firebaseAuthService.$unauth();
                $state.go('auth');
            }

            function navigateTo(state, params){
                $state.go(state, params);
            }
        }
    }
})();