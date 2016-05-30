(function(){

    'use strict';

    angular
        .module('app.user')
        .controller('UserPostController', UserPostController);

    function UserPostController(post){
        var vm = this;

        vm.post = post;

    }

})();