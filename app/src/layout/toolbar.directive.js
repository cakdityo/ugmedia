(function(){
    'use strict';

    angular
        .module('app.layout')
        .directive('ugToolbar', ugToolbar);

    function ugToolbar($mdSidenav){
        return {
            templateUrl: 'src/layout/toolbar.html',
            controller: ugToolbarController,
            controllerAs: 'tb'
        };

        function ugToolbarController($state){
            var vm = this;

            vm.goToUser = goToUser;
            vm.searchText = '';
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