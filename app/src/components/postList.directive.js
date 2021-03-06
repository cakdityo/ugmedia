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

        function PostListController($scope, Post){
            var vm = this;

            vm.posts = [];
            vm.user = $scope.user;

            angular.forEach($scope.posts, function(post){
                var post = Post.get(post.$id);
                post.$loaded().then(function(){
                    vm.posts.push(post);
                });
            });

            $scope.posts.$watch(function(snap){
                if (snap.event === 'child_added'){
                    var post = Post.get(snap.key);
                    post.$loaded().then(function(){
                        vm.posts.push(post);
                    });
                } else if (snap.event === 'child_removed') {
                    vm.posts = vm.posts.filter(function(post){
                        return post.$id !== snap.key;
                    });
                }
            });

        }
    }

})();