(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar(){
        return {
            scope: {
                auth: '='
            },
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(DataService, $scope){
            var vm = this;

            vm.post = {};
            vm.setPost = setPost;

            function setPost(post){
                post.author = $scope.auth.uid;
                if (post.author && post.caption) {
                    DataService.setPost(post);
                    vm.post = {};
                }
            }
        }
    }
})();