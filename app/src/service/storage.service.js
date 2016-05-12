(function(){

    'use strict';

    angular
        .module('app.service')
        .factory('StorageService', StorageService);

    function StorageService(Upload){

        var storage = {
            getCredentials: getCredentials,
            uploadAvatar: uploadAvatar
        };

        return storage;

        function getCredentials(){
            var creds = {
                accessKey: 'AKIAI3GWQO4NI5I5ZRDA',
                bucket: 'https://s3.amazonaws.com/ugmedia-temp/',
                policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogInVnbWVkaWEtdGVtcCJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLAogICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICIiXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGZpbGVuYW1lIiwgIiJdLAogICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDUyNDI4ODAwMF0KICBdCn0=',
                signature: 'nknd+u6WPhYfcZBdYcfVPg3TGMY='
            };
            return creds;
        }

        function uploadAvatar(user, originalAvatar, croppedAvatar){
            var creds = getCredentials();
            creds.dataKey = user.$id + '/avatar/' + originalAvatar.name;
            var upload = Upload.upload({
                url: creds.bucket, //S3 upload url including bucket name
                method: 'POST',
                headers: {
                    'Authorization': undefined
                },
                data: {
                    key: creds.dataKey, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: creds.accessKey,
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: creds.policy, // base64-encoded json policy (see article below)
                    signature: creds.signature, // base64-encoded signature based on policy string (see article below)
                    'Content-Type': 'image/jpeg', // content type of the file (NotEmpty)
                    filename: creds.dataKey, // this is needed for Flash polyfill IE8-9
                    file: window.dataURLtoBlob(croppedAvatar)
                }
            });
            return upload;
        }
    }
})();