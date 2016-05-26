(function () {

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostDetail', ugPostDetail);

    function ugPostDetail() {
        return {
            scope: {
                deletePost: '&',
                post: '=',
                user: '='
            },
            templateUrl: 'src/components/postDetail.html',
            controller: PostDetailController,
            controllerAs: 'pd'
        };

        function PostDetailController($scope, DataService) {
            var vm = this;

            vm.addComment = addComment;
            vm.author = DataService.getUser($scope.post.author);
            vm.comments = DataService.getPostComments($scope.post.$id);
            vm.commentText = '';
            vm.deletePost = $scope.deletePost;
            vm.menuAction = menuAction;
            vm.menuItems = [
                {name: 'Copy URL', icon: 'content_copy'},
                {name: 'Edit', icon: 'edit'},
                {name: 'Delete', icon: 'clear'}
            ];
            vm.post = $scope.post;
            vm.taggedUsers = DataService.getPostTaggedUsers($scope.post.$id);
            vm.user = $scope.user;

            function addComment(text) {
                if (text && $scope.user.$id) {
                    var comment = {text: text, author: $scope.user.$id, createdAt: Firebase.ServerValue.TIMESTAMP};
                    DataService.addComment(vm.comments, comment);
                    vm.commentText = '';
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