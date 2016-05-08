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

        function ugToolbarController($state, DataService){
            var vm = this;

            vm.goToUser = goToUser;
            vm.searchText = '';
            vm.users = DataService.getUsers();
            vm.toggleSidenav = toggleSidenav;

            function goToUser(username){
                if (username){
                    $state.go('user.profile',{username: username});
                }
            }

            function toggleSidenav(){
                if(!$mdSidenav('left').isLockedOpen()){
                    $mdSidenav('left').toggle();
                }
            }
        }
    }
})();