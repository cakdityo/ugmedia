(function(){
    'use strict';

    angular
        .module('app.layout')
        .directive('ugToolbar', ugToolbar);

    function ugToolbar($mdSidenav, $state){
        return {
            templateUrl: 'src/layout/toolbar.html',
            controller: ugToolbarController,
            controllerAs: 'tb'
        };

        function ugToolbarController($firebaseAuthService){
            var vm = this;

            vm.logout = logout;
            vm.toggleSidenav = toggleSidenav;

            function toggleSidenav(){
                if(!$mdSidenav('left').isLockedOpen()){
                    $mdSidenav('left').toggle();
                }
            }

            function logout(){
                $firebaseAuthService.$unauth();
                $state.go('auth');
            }
        }
    }
})();