(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostCommentList', ugPostCommentList);

    function ugPostCommentList(){
        return {
            scope: {
                comments: '=',
                id: '='
            },
            replace: true,
            templateUrl: 'src/components/postCommentList.html',
            controller: PostCommentListController,
            controllerAs: 'pcl'
        };

        function PostCommentListController(Activity, $scope){
            var vm = this;

            vm.comments = $scope.comments;
            vm.deleteComment = deleteComment;

            function deleteComment(comment){
                if (comment){
                    var activity = Activity.get(comment.activity);
                    activity.$loaded().then(function(){
                        activity.destroy();
                    });
                    vm.comments.$remove(comment);
                }
            }
        }
    }
})();