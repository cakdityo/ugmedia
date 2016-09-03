(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('ugToolbar', ugToolbar);

    function ugToolbar() {
        return {
            scope: {
                unopened: '='
            },
            templateUrl: 'src/layout/toolbar.html',
            controller: ugToolbarController,
            controllerAs: 'tb'
        };

        function ugToolbarController($firebaseObject, $firebaseRef, $mdSidenav, $scope, $state) {
            var vm = this;

            vm.searchText = '';
            vm.users = [];

            vm.goToUser = goToUser;
            vm.searchUsers = searchUsers;
            vm.toggleSidenavNotifications = toggleSidenavNotifications;
            vm.toggleSidenavUser = toggleSidenavUser;

            function goToUser(username) {
                if (username) {
                    $state.go('user.profile', {username: username});
                }
            }

            function searchUsers(query) {
                if (query) {
                    if (!query.match(/^\*/)) {
                        query = '*' + query;
                    }
                    if (!query.match(/\*$/)) {
                        query += '*';
                    }
                    var req = $firebaseRef.search.child('request').push({
                        index: 'ug-media',
                        type: 'user',
                        query: query
                    });
                    var res = $firebaseObject($firebaseRef.search.child('response').child(req.key));
                }
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
        }
    }
})();