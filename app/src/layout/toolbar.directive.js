(function(){
    'use strict';

    angular
        .module('app.layout')
        .directive('ugToolbar', ugToolbar);

    function ugToolbar(){
        return {
            templateUrl: 'src/layout/toolbar.html',
            controller: ugToolbarController,
            controllerAs: 'tb'
        };

        function ugToolbarController($mdSidenav, $state){
            var vm = this;

            vm.goToUser = goToUser;
            vm.searchText = '';
            vm.toggleSidenavNotifications = toggleSidenavNotifications;
            vm.toggleSidenavUser = toggleSidenavUser;

            function goToUser(username){
                if (username){
                    $state.go('user.profile',{username: username});
                }
            }

            function toggleSidenavNotifications(){
                if (!$mdSidenav('notifications').isLockedOpen()){
                    $mdSidenav('notifications').toggle();
                }
            }

            function toggleSidenavUser(){
                if(!$mdSidenav('user').isLockedOpen()){
                    $mdSidenav('user').toggle();
                }
            }
        }
    }
})();