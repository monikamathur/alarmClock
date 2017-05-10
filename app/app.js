var app = angular.module("alarm",['ui.router','ui.bootstrap','toaster'])


    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                template: '<div ui-view class="ui-view-main"></div>'
            })
            .state('app.homePage', {
                url: "/homePage",
                templateUrl: 'app/view/homePage.html',
                controller: 'homePageCtrl'
            })
        $urlRouterProvider.otherwise("/app/homePage");
    }]
);