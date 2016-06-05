(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('UserSettingController', UserSettingController);

    UserSettingController.$inject = ['$state', 'StorageService', 'DataService'];
    function UserSettingController($state, StorageService, DataService) {
        var vm = this;

        vm.croppedAvatar = null;
        vm.originalAvatar = false;
        vm.progress = null;
        vm.updateUser = updateUser;

        function updateUser(user) {
            if (vm.originalAvatar) {
                var upload = StorageService.uploadAvatar(user, vm.originalAvatar, vm.croppedAvatar);
                upload.then(
                    function (success) {
                        user.avatar = success.config.url + success.config.data.key;
                        user.$save();
                        $state.go('user.profile', {username: user.username});
                    }, function (error) {
                        alert('Error: ' + error);
                    }, function (progress) {
                        vm.progress = parseInt(100.0 * progress.loaded / progress.total);
                    });
            } else {
                user.$save();
                $state.go('user.profile', {username: user.username});
            }
        }
    }
})();