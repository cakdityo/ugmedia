(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostCommentList', ugPostCommentList);

    function ugPostCommentList(){
        return {
            scope: {
                comments: '='
            },
            templateUrl: 'src/components/postCommentList.html',
            controller: PostCommentListController,
            controllerAs: 'pcl'
        };

        function PostCommentListController($scope){
            var vm = this;

            vm.comments = $scope.comments;
        }
    }
})();