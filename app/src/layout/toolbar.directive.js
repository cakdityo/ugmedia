(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('ugToolbar', ugToolbar);

    function ugToolbar() {
        return {
            scope: {
                unopened: '=',
                users: '='
            },
            templateUrl: 'src/layout/toolbar.html',
            controller: ugToolbarController,
            controllerAs: 'tb'
        };

        function ugToolbarController($mdSidenav, $scope, $state) {
            var vm = this;

            vm.searchText = '';
            vm.users = $scope.users;

            vm.goToUser = goToUser;
            vm.toggleSidenavNotifications = toggleSidenavNotifications;
            vm.toggleSidenavUser = toggleSidenavUser;
            vm.querySearch = querySearch;

            function goToUser(username) {
                if (username) {
                    $state.go('user.profile', {username: username});
                }
            }

            function querySearch(query){
                var users = query ? vm.users.filter(createFilterFor(query)) : vm.users;
                return users;
            }

            function toggleSidenavNotifications() {
                if (!$mdSidenav('notifications').isLockedOpen()) {
                    if ($mdSidenav('notifications').isOpen()) {
                        $mdSidenav('notifications').close();
                    } else {
                        //should be called after close, but the $mdSidenav().onClose function has not merged yet
                        $mdSidenav('notifications').open().then(function () {
                            angular.forEach($scope.unopened, function (notification) {
                                notification.unopened = null;
                                notification.$save();
                                $scope.unopened = $scope.unopened.filter(function (notif) {
                                    return notif.$id !== notification.$id;
                                });
                            });
                        });
                    }
                }
            }

            function toggleSidenavUser() {
                if (!$mdSidenav('user').isLockedOpen()) {
                    $mdSidenav('user').toggle();
                }
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(user) {
                    return (user.username.indexOf(lowercaseQuery) === 0);
                };

            }
        }
    }
})();