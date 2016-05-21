(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostDetail', ugPostDetail);

    function ugPostDetail(){
        return {
            scope: {
                post: '=',
                onDelete: '&'
            },
            templateUrl: 'src/components/postDetail.html',
            controller: PostDetailController,
            controllerAs: 'pc'
        };

        function PostDetailController($scope, DataService){
            var vm = this;

            vm.author = DataService.getUser($scope.post.author);
            vm.deletePost = $scope.onDelete;
            vm.post = $scope.post;

        }
    }

})();