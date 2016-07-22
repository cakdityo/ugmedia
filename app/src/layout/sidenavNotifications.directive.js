(function(){

    'use strict';

    angular
        .module('app.layout')
        .directive('ugSidenavNotifications', ugSidenavNotifications);

    function ugSidenavNotifications(){
        return {
            scope: {
                notifications: '='
            },
            templateUrl: 'src/layout/sidenavNotifications.html',
            controller: SidenavNotificationsController,
            controllerAs: 'sn'
        };

        function SidenavNotificationsController(Activity, $scope){
            var vm = this;

            vm.notifications = [];

            angular.forEach($scope.notifications, function(notification){
                notification = Activity.get(notification.$id);
                notification.$loaded().then(function(){
                    vm.notifications.push(notification);
                })
            });

            $scope.notifications.$watch(function(snap){
                if (snap.event === 'child_added'){
                    var notification = Activity.get(snap.key);
                    notification.$loaded().then(function(){
                        vm.notifications.push(notification);
                    });
                } else if (snap.event === 'child_removed') {
                    vm.notifications = vm.notifications.filter(function(notification){
                        return notification.$id !== snap.key;
                    });
                }
            });

        }
    }
})();