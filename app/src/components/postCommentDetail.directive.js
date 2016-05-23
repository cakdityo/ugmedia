(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostCommentDetail', ugPostCommentDetail);

    function ugPostCommentDetail(){
        return {
            scope: {
                comment: '='
            },
            replace: true,
            templateUrl: 'src/components/postCommentDetail.html',
            controller: PostCommentDetailController,
            controllerAs: 'pcd'
        };

        function PostCommentDetailController($scope, DataService){
            var vm = this;

            vm.author = DataService.getUser($scope.comment.author);
            vm.comment = $scope.comment;
        }
    }
})();