(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar(){
        return {
            scope: {
                posts: '=',
                user: '=',
                users: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(DataService, $scope){
            var vm = this;

            vm.post = {};
            vm.mentionedUsers = [];
            vm.setPost = setPost;
            vm.user = $scope.user;
            vm.users = $scope.users;
            vm.querySearch = querySearch;


            function setPost(post){
                post.author = $scope.user.$id;
                post.createdAt = Firebase.ServerValue.TIMESTAMP;
                if (post.author && post.caption) {
                    DataService.addPost($scope.posts, post, vm.mentionedUsers);
                    vm.post = {};
                    vm.mentionedUsers = [];
                }
            }

            function querySearch (query) {
                return query ? vm.users.filter(createFilterFor(query)) : [];
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(contact) {
                    return (contact.username.indexOf(lowercaseQuery) != -1);
                };

            }
        }
    }
})();