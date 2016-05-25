(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostCommentList', ugPostCommentList);

    function ugPostCommentList(){
        return {
            scope: {
                comments: '=',
                id: '=',
                postAuthor: '='
            },
            replace: true,
            templateUrl: 'src/components/postCommentList.html',
            controller: PostCommentListController,
            controllerAs: 'pcl'
        };

        function PostCommentListController($scope, DataService){
            var vm = this;

            vm.comments = $scope.comments;
            vm.deleteComment = deleteComment;
            vm.user = $scope.user;

            function deleteComment(comment){
                if (comment){
                    DataService.deleteComment(vm.comments, comment);
                }
            }
        }
    }
})();