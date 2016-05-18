(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugPostBar', ugPostBar);

    function ugPostBar(){
        return {
            templateUrl: 'src/components/postBar.html',
            controller: postBarController,
            controllerAs: 'pb'
        };

        function postBarController(){
            var vm = this;

            vm.tes = "Hello adityo!";
            vm.post = '';
        }
    }
})();