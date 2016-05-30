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

        function PostDetailController($scope, DataService, $state) {
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
            vm.user = $scope.user;

            function addComment(text) {
                if (text && $scope.user.$id) {
                    var comment = {text: text, author: $scope.user.$id};
                    DataService.addComment(vm.comments, comment);
                    DataService.setUserNotification(vm.post.author, {
                        comment: text,
                        post: vm.post.$id,
                        sender: comment.author
                    });
                    vm.commentText = '';
                }
            }

            function deletePost(post) {
                DataService.deletePost(post);
                $state.go('user.profile', {username: vm.user.username})
            }

            function likePost(state) {
                DataService.setPostLike(vm.post.$id, vm.user.$id, state);
                if (state) {
                    DataService.setUserNotification(vm.post.author, {
                        liked: true,
                        post: vm.post.$id,
                        sender: vm.user.$id
                    });
                }
            }

            function menuAction(menuName) {
                if (menuName === 'Copy URL') {
                    alert("URL copied!");
                } else if (menuName === 'Edit') {

                } else if (menuName === 'Delete') {
                    vm.deletePost(vm.post);
                }
            }

        }
    }

})();