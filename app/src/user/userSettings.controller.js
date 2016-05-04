(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['$state'];
    function UserSettingsController($state){
        var vm = this;

        vm.picFile = false;
        vm.croppedAvatar = null;
        vm.updateUser = updateUser;

        function updateUser(user){
            if (vm.picFile){
                user.avatar = vm.croppedAvatar;
            }
            user.$save();
            $state.go('user.profile', {username: user.username});
        }
    }
})();