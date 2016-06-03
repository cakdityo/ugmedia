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

        function PostDetailController($scope, DataService) {
            var vm = this;

            $scope.post.$loaded().then(function () {
                vm.post = $scope.post;
                vm.author = DataService.getUser($scope.post.author);
                vm.comments = DataService.getPostComments($scope.post.$id);
                vm.likes = DataService.getPostLikes($scope.post.$id);
                vm.taggedUsers = DataService.getPostTaggedUsers($scope.post.$id);
            });

            vm.addComment = addComment;
            vm.commentText = '';
            vm.deletePost = deletePost;
            vm.likePost = likePost;
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
                    var comment = {text: text, author: vm.user.profile.$id};
                    DataService.addComment(vm.comments, comment);
                    DataService.setUserNotification(vm.post.author, {
                        comment: text,
                        post: vm.post.$id,
                        sender: comment.author
                    });
                    vm.commentText = '';
                }
            }

            function deletePost() {
                if (vm.user.profile.$id === vm.author.$id) {
                    DataService.deletePost(vm.post, vm.user.followers);
                }
            }

            function likePost(state) {
                DataService.setPostLike(vm.post.$id, vm.user.profile.$id, state);
                if (state) {
                    DataService.setUserNotification(vm.post.author, {
                        liked: true,
                        post: vm.post.$id,
                        sender: vm.user.profile.$id
                    });
                }
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