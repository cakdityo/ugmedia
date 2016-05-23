(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar(){
        return {
            scope: {
                posts: '=',
                user: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(DataService, $scope){
            var vm = this;

            vm.post = {};
            vm.setPost = setPost;
            vm.user = $scope.user;

            function setPost(post){
                post.author = $scope.user.$id;
                post.createdAt = Firebase.ServerValue.TIMESTAMP;
                if (post.author && post.caption) {
                    DataService.addPost($scope.posts, post);
                    vm.post = {};
                }
            }
        }
    }
})();