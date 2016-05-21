(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar(){
        return {
            scope: {
                posts: '=',
                auth: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(DataService, $scope){
            var vm = this;

            vm.post = {};
            vm.setPost = setPost;

            function setPost(post){
                post.author = $scope.auth.uid;
                post.createdAt = Firebase.ServerValue.TIMESTAMP;
                if (post.author && post.caption) {
                    DataService.addPost($scope.posts, post);
                    vm.post = {};
                }
            }
        }
    }
})();