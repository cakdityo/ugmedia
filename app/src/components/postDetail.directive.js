(function () {

    'use strict';

    angular
        .module('app.component')
        .directive('ugPostDetail', ugPostDetail);

    function ugPostDetail() {
        return {
            scope: {
                post: '=',
                user: '='
            },
            templateUrl: 'src/components/postDetail.html',
            controller: PostDetailController,
            controllerAs: 'pd'
        };

        function PostDetailController(Activity, Storage, $scope, $state) {
            var vm = this;

            $scope.post.$loaded().then(function () {
                vm.post = $scope.post;
                vm.author = $scope.post.getAuthor();
                vm.comments = $scope.post.getComments();
                vm.likes = $scope.post.getLikes();
                vm.taggedUsers = $scope.post.getTaggedUsers();
            });

            vm.addComment = addComment;
            vm.commentText = '';
            vm.deletePost = deletePost;
            vm.setLikePost = setLikePost;
            vm.setUnlikePost = setUnlikePost;
            vm.menuAction = menuAction;
            vm.menuItems = [
                {name: 'Copy URL', icon: 'content_copy'},
                {name: 'Edit', icon: 'edit'},
                {name: 'Delete', icon: 'clear'}
            ];
            vm.postObject = 'comments';
            vm.showPostObject = showPostObject;
            vm.user = $scope.user;

            function addComment(text) {
                if (text && vm.user.profile.$id) {
                    var newActivity = Activity.set({
                        author: vm.user.profile.$id,
                        comment: text,
                        post: vm.post.$id
                    }, [vm.author]);
                    vm.comments.$add({
                        activity: newActivity.key,
                        author: vm.user.profile.$id,
                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                        text: text
                    }).then(function () {
                        vm.commentText = '';
                    });
                }
            }

            function deletePost() {
                if (vm.user.profile.$id === vm.author.$id) {
                    if (vm.post.image || vm.post.document) {
                        var file = (vm.post.image || vm.post.document.url);
                        var fileRef = Storage.refFromURL(file);
                        fileRef.delete().then(function () {
                            vm.post.destroy(vm.user.followers);
                        });
                    } else {
                        vm.post.destroy(vm.user.followers);
                    }
                }
            }

            function setLikePost() {
                var newActivity = Activity.set({
                    author: vm.user.profile.$id,
                    liked: true,
                    post: vm.post.$id
                }, [vm.author]);
                vm.post.setLike(vm.user.profile.$id, newActivity.key);
            }

            function setUnlikePost(like) {
                var activity = Activity.get(like.$value);
                activity.$loaded().then(function(){
                    activity.destroy([vm.author.$id]);
                });
                vm.post.setUnlike(vm.user.profile.$id);
            }

            function menuAction(menuName) {
                if (menuName === 'Copy URL') {
                    alert("URL copied!");
                } else if (menuName === 'Edit') {
                    $state.go('user.post', {postID: vm.post.$id});
                } else if (menuName === 'Delete') {
                    vm.deletePost();
                }
            }

            function showPostObject(object) {
                vm.postObject = object;
            }

        }
    }

})();