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
            vm.comment = '';
            vm.deletePost = $scope.deletePost;
            vm.menuAction = menuAction;
            vm.menuItems = [
                {name: 'Copy URL', icon: 'content_copy'},
                {name: 'Delete', icon: 'clear'}
            ];
            vm.post = $scope.post;
            vm.user = $scope.user;

            function addComment(comment) {
                if (comment && $scope.user.$id) {
                    DataService.addComment(vm.comments, {text: comment, author: $scope.user.$id});
                    vm.comment = '';
                }
            }

            function menuAction(menuName) {
                if (menuName === 'Copy URL') {
                    alert("URL copied!");
                } else if (menuName === 'Delete') {
                    vm.deletePost(vm.post);
                }
            }

        }
    }

})();