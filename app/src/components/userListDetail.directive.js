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

        function UserListDetailController($scope, User){
            $scope.user = User.get($scope.user.$id);
        }
    }

})();