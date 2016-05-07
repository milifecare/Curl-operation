/*TODO seperate controller for seperate view*/
angular
.module("UserManagement")
.controller('userListCtrl', ['$scope', 'UserService', function($scope,UserService){
	$scope.user_list = [];
	UserService
	.fetchList()
	.then(function(resp){
		$scope.user_list = resp;
	},function(err){

	})
	$scope.deleteUser = function(user){
		UserService
		.remove(user)
		.then(function(resp){
			console.log("User Updated",user);
			$scope.user_list.splice($scope.user_list.indexOf(user), 1);
		},function(err){

		})
	}
}])
 .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]).
      service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl,cb){
               var fd = new FormData();
               /*upl is the key by whcih we are getting file at server side*/
               fd.append('upl', file);
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
               .success(function(resp){
               	cb(resp);
               })
               .error(function(){
               });
            }
         }])
.controller('createUserCtrl', ['$scope', 'UserService', 'fileUpload', '$state', function($scope,UserService,fileUpload,$state){
	/*Sholud be factory*/
	function User(){
		this.name 		= "";
		this.address 	= "";
		this.education 	= "";
		this.mobile_no 	= "";
		this.avatar 	= "";
	}
	/*To bind with view */
	$scope.new_user = new User();
	$scope.saveUser = function(user){
		UserService
		.add(user)
		.then(function(resp){
			/*TODO notify user*/
			console.log("User Added",user);
			/*Reset Form*/
			$scope.new_user = new User();
			$state.go('users');
		},function(err){

		})
	}
	$scope.options ={
		courseFile : [],
	};
	/*SHould be return from server*/
	var DATA_PATH = window.location.protocol+"//"+window.location.host;
	 $scope.upload = function(){
               var file = $scope.myFile;
               var uploadUrl = (DATA_PATH+"/api/v1/services/upload-image");
               fileUpload.uploadFileToUrl(file, uploadUrl,function(resp){
               	$scope.new_user.avatar = resp.url;
               });
            };
}])
.controller('editUserCtrl', ['$scope','$stateParams', 'UserService', '$state', function($scope,$stateParams,UserService,$state){
	UserService
	.getUser($stateParams.user_id)
	.then(function(resp){
		$scope.new_user = resp;
			console.log("User Updated",resp);
		},function(err){

		})
	$scope.updateUser = function(user){
		UserService
		.updateUser(user)
		.then(function(resp){
			console.log("User Updated",user);
			$state.go('users');
		},function(err){

		})
	}
	
}])
.factory('UserService', ['$http', '$q', function($http,$q){
	/*For cach in local*/
	var list = [];
	/*Improve this just for now*/
	var DATA_PATH = window.location.protocol+"//"+window.location.host;
	return {
        fetchList: function() {
        	var url 	= DATA_PATH+"/api/v1/user";
            var defer 	= $q.defer();
            $http.get(url).then(function(resp){
            	list = resp.data.result;
            	defer.resolve(list);
            },function(err){
            	console.log(err);
            	defer.reject(err);
            })
            
            return defer.promise;
        },
        getList: function() {
            return list;
        },
        getLength : function(){
            return list.length;
        },
        getUser: function(id) {
            var url 	= DATA_PATH+"/api/v1/user/"+id;
            var defer 	= $q.defer();
           $http.get(url).then(function(resp){
            	defer.resolve(resp.data.result);
            },function(err){
            	console.log(err);
            	defer.reject(err);
            })
            return defer.promise;
        },
        add : function(user){
            var url = DATA_PATH+"/api/v1/user";
            var defer = $q.defer();
           $http.post(url,user).then(function(resp){
            	defer.resolve(resp.data.result);
            },function(err){
            	console.log(err);
            	defer.reject(err);
            })
            return defer.promise;
        },
        updateUser : function(user){
            var url = DATA_PATH+"/api/v1/user/"+user.id;
            var defer = $q.defer();
            $http.put(url,user).then(function(resp){
            	var user = resp.data.result;
            	defer.resolve(user);
            },function(err){
            	console.log(err);
            	defer.reject(err);
            })
            
            return defer.promise;
        },
        remove : function(user){
            var url = DATA_PATH+"/api/v1/user/"+user.id;
            var defer = $q.defer();
            $http.delete(url).then(function(resp){
            	var user = resp.data.result;
            	defer.resolve(user);
            },function(err){
            	console.log(err);
            	defer.reject(err);
            })
            
            return defer.promise;
        },
        uploadImage : function(url){
        	/*Handle it*/
        }
    }
}])