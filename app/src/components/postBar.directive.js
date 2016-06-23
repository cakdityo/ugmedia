(function () {
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar() {
        return {
            scope: {
                post: '=',
                user: '=',
                users: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(Post, Storage, User, $scope) {
            var vm = this;

            vm.checkFile = checkFile;
            vm.cleanUp = cleanUp;
            vm.cropAspectRatio = 'square';
            vm.croppedImage = null;
            vm.document = null;
            vm.file = null;
            vm.image = null;
            vm.post = $scope.post;
            vm.setObjects = setObjects;
            vm.setPost = setPost;
            vm.taggedUsers = [];
            vm.updatePost = updatePost;
            vm.user = $scope.user;
            vm.users = $scope.users;
            vm.users.splice(vm.users.$indexFor(vm.user.profile.$id), 1);
            vm.querySearch = querySearch;

            function checkFile(file){
                vm.document = null;
                vm.image = null;
                if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                    vm.document = file;
                } else if (file.type === 'image/jpeg' || file.type === 'image/png'){
                    vm.image = file;
                } else {
                    alert('File is not supported!');
                    vm.file = null;
                }
            }

            function cleanUp(){
                vm.croppedImage = null;
                vm.document = null;
                vm.file = null;
                vm.image = null;
                vm.post = {};
                vm.progress = null;
                vm.taggedUsers = [];
            }

            function setPost() {
                vm.post.author = vm.user.profile.$id;
                if (vm.post.author && vm.post.caption) {
                    var newPost = Post.push();

                    if (vm.croppedImage || vm.document) {
                        var file, fileName;
                        vm.progress = 0;
                        if (vm.image) {
                            file = vm.croppedImage;
                            fileName = vm.image.name;
                        } else if (vm.document) {
                            file = vm.document;
                            fileName = vm.document.name;
                        }
                        var upload = Storage.ref().child('posts').child(newPost.key).child(fileName).put(file);
                        upload.on('state_changed', function (snapshot) {
                            $scope.$apply(function () {
                                vm.progress = parseInt(100.0 * snapshot.bytesTransferred / snapshot.totalBytes);
                            });
                        }, function (error) {
                            alert(error);
                        }, function () {
                            if (vm.croppedImage) {
                                vm.post.image = upload.snapshot.downloadURL;
                            } else if (vm.document) {
                                vm.post.document = {};
                                vm.post.document.name = fileName;
                                vm.post.document.url = upload.snapshot.downloadURL;
                            }

                            Post.set(newPost.key, vm.post);
                            vm.setObjects(vm.post.author, newPost.key, vm.taggedUsers, vm.user.followers);
                            vm.cleanUp();
                        });
                    } else {
                        Post.set(newPost.key, vm.post);
                        vm.setObjects(vm.post.author, newPost.key, vm.taggedUsers, vm.user.followers);
                        vm.cleanUp();
                    }
                }
            }

            function updatePost() {
                if (vm.post.author && vm.post.caption) {

                    if (vm.croppedImage || vm.document) {
                        var currentFile, file, fileName;
                        vm.progress = 0;
                        //Clean data
                        currentFile = Storage.refFromURL((vm.post.image || vm.post.document.url));
                        currentFile.delete().then(function(){
                            vm.post.document = null;
                            vm.post.image = null;
                        });
                        if (vm.image) {
                            file = vm.croppedImage;
                            fileName = vm.image.name;
                        } else if (vm.document) {
                            file = vm.document;
                            fileName = vm.document.name;
                        }

                        var upload = Storage.ref().child('posts').child(vm.post.$id).child(fileName).put(file);
                        upload.on('state_changed', function (snapshot) {
                            $scope.$apply(function () {
                                vm.progress = parseInt(100.0 * snapshot.bytesTransferred / snapshot.totalBytes);
                            });
                        }, function (error) {
                            alert(error);
                        }, function () {
                            if (vm.croppedImage) {
                                vm.post.image = upload.snapshot.downloadURL;
                            } else if (vm.document) {
                                vm.post.document = {};
                                vm.post.document.name = fileName;
                                vm.post.document.url = upload.snapshot.downloadURL;
                            }

                            vm.post.$save();
                            vm.progress = null;
                        });
                    } else {
                        vm.post.$save();
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

            function setObjects(authorID, postID, taggedUsers, authorFollowers) {
                vm.user.profile.setPost(postID);
                User.setFeed(authorID, postID);

                if (taggedUsers.length > 0) {
                    angular.forEach(taggedUsers, function (user) {
                        Post.setTaggedUser(postID, user.$id);
                        User.setNotification(user.$id, {
                            sender: authorID,
                            post: postID,
                            tagged: true
                        })
                    });
                }

                if (authorFollowers.length > 0) {
                    angular.forEach(authorFollowers, function (follower) {
                        User.setFeed(follower.$id, postID);
                    });
                }
            }
        }
    }
})();