(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostList', ugPostList);

    function ugPostList(){
        return {
            scope: {
                posts: '=',
                user: '='
            },
            templateUrl: 'src/components/postList.html',
            controller: PostListController,
            controllerAs: 'pl'
        };

        function PostListController($scope, DataService){
            var vm = this;

            vm.deletePost = deletePost;
            vm.posts = $scope.posts;
            vm.user = $scope.user;

            function deletePost(post){
                DataService.deletePost(vm.posts, post);
            }
        }
    }

})();