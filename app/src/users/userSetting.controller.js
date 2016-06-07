(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('UserSettingController', UserSettingController);

    UserSettingController.$inject = ['Storage', '$scope', '$state'];

    function UserSettingController(Storage, $scope, $state) {
        var vm = this;

        vm.croppedAvatar = null;
        vm.originalAvatar = false;
        vm.progress = null;
        vm.updateUser = updateUser;

        function updateUser(user) {
            if (vm.originalAvatar) {
                var storageRef = Storage.ref();
                var upload = storageRef.child('avatars').child(user.$id).put(vm.croppedAvatar);
                upload.on('state_changed', function (snapshot) {
                    $scope.$apply(function () {
                        vm.progress = parseInt(100.0 * snapshot.bytesTransferred / snapshot.totalBytes);
                    });
                }, function (error) {

                }, function () {
                    $scope.$apply(function () {
                        user.avatar = upload.snapshot.downloadURL;
                        user.$save();
                        $state.go('user.profile', {username: user.username});
                    });
                });
            } else {
                user.$save();
                $state.go('user.profile', {username: user.username});
            }
        }
    }
})();