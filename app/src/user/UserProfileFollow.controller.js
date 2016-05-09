(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileFollowController', UserProfileFollowController);

    UserProfileFollowController.$inject = ['friends', '$state'];

    function UserProfileFollowController(friends, $state){
        var vm = this;

        vm.friends = friends;
        vm.followState = $state.current.name;
        vm.searchText = '';
    }

})();