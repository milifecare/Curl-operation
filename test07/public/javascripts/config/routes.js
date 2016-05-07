angular.module("UserManagement",['ui.router']);
angular.module("UserManagement")
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
        function($httpProvider, $stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('users', {
                    url         : "/",
                    controller  : "userListCtrl",
                    templateUrl : "templates/userlist.html",
                })
                .state('new-user', {
                    url         : "/create-user",
                    controller  : "createUserCtrl",
                    templateUrl : "templates/create-user.html",
                })
                .state('edit-user', {
                    url         : "/edit-user/:user_id",
                    controller  : "editUserCtrl",
                    templateUrl : "templates/edit-user.html",
                })
        }
    ]);
