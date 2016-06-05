(function () {

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostDetail', ugPostDetail);

    function ugPostDetail() {
        return {
            scope: {
                post: '=',
                user: '='
            },
            templateUrl: 'src/components/postDetail.html',
            controller: PostDetailController,
            controllerAs: 'pd'
        };

        function PostDetailController($scope, User) {
            var vm = this;

            $scope.post.$loaded().then(function () {
                vm.post = $scope.post;
                vm.author = $scope.post.getAuthor();
                vm.comments = $scope.post.getComments();
                vm.likes = $scope.post.getLikes();
                vm.taggedUsers = $scope.post.getTaggedUsers();
            });

            vm.addComment = addComment;
            vm.commentText = '';
            vm.deletePost = deletePost;
            vm.setLikePost = setLikePost;
            vm.setUnlikePost = setUnlikePost;
            vm.menuAction = menuAction;
            vm.menuItems = [
                {name: 'Copy URL', icon: 'content_copy'},
                {name: 'Edit', icon: 'edit'},
                {name: 'Delete', icon: 'clear'}
            ];
            vm.postObject = 'comments';
            vm.showPostObject = showPostObject;
            vm.user = $scope.user;

            function addComment(text) {
                if (text && vm.user.profile.$id) {
                    vm.comments.$add({
                        text: text,
                        author: vm.user.profile.$id,
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    }).then(function(){
                        User.setNotification(vm.post.author, {
                            comment: text,
                            post: vm.post.$id,
                            sender: vm.user.profile.$id
                        });
                        vm.commentText = '';
                    });
                }
            }

            function deletePost() {
                if (vm.user.profile.$id === vm.author.$id) {
                    vm.post.destroy(vm.user.followers);
                }
            }

            function setLikePost() {
                vm.post.setLike(vm.user.profile.$id);
                User.setNotification(vm.post.author, {
                    liked: true,
                    post: vm.post.$id,
                    sender: vm.user.profile.$id
                });
            }

            function setUnlikePost() {
                vm.post.setUnlike(vm.user.profile.$id);
            }

            function menuAction(menuName) {
                if (menuName === 'Copy URL') {
                    alert("URL copied!");
                } else if (menuName === 'Edit') {

                } else if (menuName === 'Delete') {
                    vm.deletePost();
                }
            }

            function showPostObject(object) {
                vm.postObject = object;
            }

        }
    }

})();