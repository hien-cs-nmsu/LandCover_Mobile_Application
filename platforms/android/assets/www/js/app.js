angular.module('ionicApp', ['ionic','ionicApp.controller','ngCordova'])

.config(['$httpProvider', function($httpProvider) {
	 //$httpProvider.defaults.withCredentials = true;
	 $httpProvider.defaults.headers.common = {};
	 $httpProvider.defaults.headers.post = {};
	 $httpProvider.defaults.headers.put = {};
	 $httpProvider.defaults.headers.patch = {};
}])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('landcover', {
      url: "/landcover",
      abstrsct : true,
      templateUrl: "templates/tabs.html"
    })
    
    .state('landcover.login', {
      url: "/login",
      views: {
        'home-tab': {
          templateUrl: "templates/login.html",
          controller: 'SignInCtrl'
        }
      }
    })
  .state('landcover.settings', {
      url: "/settings",
      views: {
        'settings-tab': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'  
        }
      }
    });
  
  var listAuthentication = window.localStorage.getItem("AUTHENTICATION_LIST");
  console.log("Test " + listAuthentication);
  if (listAuthentication === null || listAuthentication === 'null'){
	   $urlRouterProvider.otherwise("/landcover/login");
  } else {
	   var jsonObjAuth = JSON.parse(listAuthentication);
	   if (jsonObjAuth['authentication'].length == 1){	   
		   window.localStorage.setItem("current_json_auth_data", jsonObjAuth['authentication'][0].json_auth_data);
		   window.localStorage.setItem("current_email",jsonObjAuth['authentication'][0].email);
		   window.localStorage.setItem("current_password",jsonObjAuth['authentication'][0].password);
		   //window.localStorage.setItem("PREVIOUS_PAGE","LOGIN_PAGE");
		   $urlRouterProvider.otherwise("/landcover/main");
	   } else {
		   $urlRouterProvider.otherwise("/landcover/accounts");
	   }
	   
  }
});







