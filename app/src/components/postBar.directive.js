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
            vm.taggedUsers = [];
            vm.setPost = setPost;
            vm.user = $scope.user;
            vm.users = $scope.users;
            vm.users.splice(vm.users.$indexFor($scope.user.$id), 1);
            vm.querySearch = querySearch;

            function setPost(post){
                post.author = $scope.user.$id;
                post.createdAt = Firebase.ServerValue.TIMESTAMP;
                if (post.author && post.caption) {
                    //Add new post.
                    var promise = DataService.addPost($scope.posts, post);
                    promise.then(function(newPost){
                        //Add reference of this post to author's user post object.
                        DataService.setUserPost(post.author, newPost.key(), true);

                        if (vm.taggedUsers.length > 0){
                            //if there is at least one user tagged,
                            angular.forEach(vm.taggedUsers, function(user){
                                //Set post taggedUsersObject,
                                DataService.setPostTaggedUser(newPost.key(), user.$id);
                                //Notice the tagged user.
                                DataService.setUserNotification(user.$id, {sender: post.author, post: newPost.key()})
                            });
                        }

                        //clean up variables.
                        vm.post = {};
                        vm.taggedUsers = [];
                    });
                }
            }

            function querySearch (query) {
                return query ? vm.users.filter(createFilterFor(query)) : [];
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(user) {
                    return (user.username.indexOf(lowercaseQuery) != -1);
                };

            }
        }
    }
})();