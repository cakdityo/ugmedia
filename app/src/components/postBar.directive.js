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

            vm.fileValidation = {size: {max: '15MB'}, pattern: '.jpg, .png, .doc, .docx, .pdf'};
            vm.image = null;
            vm.post = {};
            vm.resizeImage = resizeImage;
            vm.taggedUsers = [];
            vm.setPost = setPost;
            vm.user = $scope.user;
            vm.users = $scope.users;
            vm.users.splice(vm.users.$indexFor(vm.user.profile.$id), 1);
            vm.querySearch = querySearch;

            function resizeImage(width, height) {
                var w = width - 10;
                var h = height - 10;
                return {width: w, height: h, quality: 1.0};
            }

            function setPost(post) {
                post.author = vm.user.profile.$id;
                if (post.author && post.caption) {
                    var newPost = Post.push();

                    if (vm.image) {
                        var upload = Storage.ref().child('posts').child(newPost.key).put(vm.image);
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
                            vm.image = null;
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