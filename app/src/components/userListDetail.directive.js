(function () {

    'use strict';

    angular
        .module('app.component')
        .directive('ugUserListDetail', ugUserListDetail);

    function ugUserListDetail() {
        return {
            scope: {
                authUser: '=',
                user: '='
            },
            replace: true,
            templateUrl: 'src/components/userListDetail.html',
            controller: UserListDetailController
        };

        function UserListDetailController($scope, DataService){
            $scope.user = DataService.getUser($scope.user.$id);

            $scope.authUser.objects.followers.$watch(function(snap){
                if (snap){
                    $scope.user = DataService.getUser($scope.user.$id);
                }
            });

            $scope.authUser.objects.following.$watch(function(snap){
                if (snap){
                    $scope.user = DataService.getUser($scope.user.$id);
                }
            });
        }
    }

})();