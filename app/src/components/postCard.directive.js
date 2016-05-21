(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostCard', ugPostCard);

    function ugPostCard(){
        return {
            scope: {
                post: '='
            },
            templateUrl: 'src/components/postCard.html',
            controller: postCardController,
            controllerAs: 'pc'
        };

        function postCardController($scope, DataService){
            var vm = this;

            vm.post = $scope.post;
            vm.author = DataService.getUser($scope.post.author);
        }
    }

})();