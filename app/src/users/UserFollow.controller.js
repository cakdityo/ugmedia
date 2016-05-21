(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserFollowController', UserFollowController);

    UserFollowController.$inject = ['friends', '$state'];

    function UserFollowController(friends, $state){
        var vm = this;

        vm.friends = friends;
        vm.followState = $state.current.name;
        vm.searchText = '';
        vm.tes = tes;

        function tes(event){

        }
    }

})();