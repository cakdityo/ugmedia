(function () {
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar() {
        return {
            scope: {
                user: '=',
                users: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(Post, Storage, User, $scope) {
            var vm = this;

            //if not inside $scope it will throw an error.
            vm.croppedImage = null;
            $scope.image = null;

            vm.cropAspectRatio = 'square';
            vm.post = {};
            vm.taggedUsers = [];
            vm.setPost = setPost;
            vm.user = $scope.user;
            vm.users = $scope.users;
            vm.users.splice(vm.users.$indexFor(vm.user.profile.$id), 1);
            vm.querySearch = querySearch;

            function setPost(post) {
                post.author = vm.user.profile.$id;
                if (post.author && post.caption) {
                    var newPost = Post.push();

                    if ($scope.image) {
                        var upload = Storage.ref().child('posts').child(newPost.key).put(vm.croppedImage);
                        upload.on('state_changed', function (snapshot) {
                            $scope.$apply(function () {
                                vm.progress = parseInt(100.0 * snapshot.bytesTransferred / snapshot.totalBytes);
                            });
                        }, function (error) {

                        }, function () {
                            post.image = upload.snapshot.downloadURL;
                            Post.set(newPost.key, post);

                            vm.user.profile.setPost(newPost.key);
                            User.setFeed(post.author, newPost.key);

                            if (vm.taggedUsers.length > 0) {
                                angular.forEach(vm.taggedUsers, function (user) {
                                    Post.setTaggedUser(newPost.key, user.key);
                                    User.setNotification(user.key, {
                                        sender: post.author,
                                        post: newPost.key,
                                        tagged: true
                                    })
                                });
                            }

                            if (vm.user.followers.length > 0) {
                                angular.forEach(vm.user.followers, function (follower) {
                                    User.setFeed(follower.$id, newPost.key);
                                });
                            }

                            //-------------->Clean up variables.
                            vm.croppedImage = null;
                            $scope.image = null;
                            vm.post = {};
                            vm.progress = null;
                            vm.taggedUsers = [];
                        });
                    } else {
                        Post.set(newPost.key, post);
                    }
                }
            }

            function querySearch(query) {
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