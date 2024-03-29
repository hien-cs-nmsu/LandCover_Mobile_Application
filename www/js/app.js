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
          controller: 'SignIn_Ctrl'
        }
      }
  })
  
  .state('landcover.clear', {
      url: "/clear",
      views: {
        'home-tab': {
          templateUrl: "templates/clear.html",
          controller: 'Clear_Ctrl'
        }
      }
   })
    
  .state('landcover.accounts', {
      url: "/accounts",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/accounts.html",
          controller: 'List_Accounts_Ctrl'
        }
      }
    })
  .state('landcover.landinfo_plots', {
      url: "/landinfo_plots",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/landinfo_plots.html",
          controller: 'List_LandInfo_Plots_Ctrl'
        }
      }
   })
  .state('landcover.main_transect', {
      url: "/main_transect",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/main_transect.html",
          controller: 'Main_Transect_Ctrl'
        }
      }
   })
   .state('landcover.north_transect', {
      url: "/main_transect",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/north_transect.html",
          controller: 'North_Transect_Ctrl'
        }
      }
   })
   .state('landcover.transect_cover', {
      url: "/transect_cover",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/transect_cover.html",
          controller: 'Transect_Cover_Ctrl'
        }
      }
   })
  .state('landcover.east_transect', {
      url: "/east_transect",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/east_transect.html",
          controller: 'East_Transect_Ctrl'
        }
      }
   })
  .state('landcover.south_transect', {
      url: "/south_transect",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/south_transect.html",
          controller: 'South_Transect_Ctrl'
        }
      }
   })
   .state('landcover.west_transect', {
      url: "/west_transect",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/west_transect.html",
          controller: 'West_Transect_Ctrl'
        }
      }
   })
  .state('landcover.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
   .state('landcover.app_information', {
      url: "/app_information",
      views: {
        'about-tab': {
          templateUrl: "templates/app_information.html"
        }
      }
    })
   .state('landcover.data_policy', {
      url: "/data_policy",
      views: {
        'about-tab': {
          templateUrl: "templates/data_policy.html"
        }
      }
    }) 
   
  .state('landcover.settings', {
      url: "/settings",
      views: {
        'settings-tab': {
          templateUrl: "templates/settings.html",
          controller: 'Settings_Ctrl'  
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
		   $urlRouterProvider.otherwise("/landcover/landinfo_plots");
	   } else {
		   $urlRouterProvider.otherwise("/landcover/accounts");
	   }   
  }
});







