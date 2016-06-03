(function(){
    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavUser', ugSidenavUser);

    function ugSidenavUser(){
        return {
            templateUrl: 'src/layout/sidenavUser.html',
            controller: SidenavUserController,
            controllerAs: 'su'
        };

        function SidenavUserController(Auth, $state){
            var vm = this;

            vm.logout = logout;
            vm.navigateTo = navigateTo;

            function logout(){
                Auth.$signOut();
                $state.go('auth');
            }

            function navigateTo(state, params){
                $state.go(state, params);
            }
        }
    }
})();