angular.module('ionicApp.controller',['ngCordova'])
/****************************************/
/*
 * Manage Controller
 */
/****************************************/

/****************************************/
/** List Account Controller **/
/****************************************/
.controller('List_Accounts_Ctrl', function($scope, $state, $http, $ionicHistory) {
	var listAuthentication = window.localStorage.getItem("AUTHENTICATION_LIST");
	var jsonObjAuth = JSON.parse(listAuthentication);
	$scope.accounts = jsonObjAuth['authentication'];
	function clearCache() {
		$ionicHistory.clearCache();
		//$ionicHistory.clearHistory();
	}
	$scope.selectAccount = function(account){
		window.localStorage.setItem("current_json_auth_data", account.json_auth_data);
		window.localStorage.setItem("current_email",account.email);
		window.localStorage.setItem("current_password",account.password);
		//clearCache();   
		window.localStorage.setItem("PREVIOUS_PAGE","ACCOUNTS_PAGE");
		$state.go('landcover.landinfo_plots');
	};
}) 
// End ListAccountsCtrl

/****************************************/
/** Settings Controller **/
/****************************************/
.controller('Settings_Ctrl', function($scope, $state, $http,$ionicHistory) {
	$ionicHistory.clearCache();
	$scope.landcover_logout = function() {
		var objAuth = window.localStorage.getItem("AUTHENTICATION_LIST");
		var email = window.localStorage.getItem("current_email"); 
		if (!isEmpty(objAuth) && !isEmpty(email)){
			var listAuthentication = JSON.parse(objAuth);
			if (checkExist(email, listAuthentication['authentication']) == true){
				var confirm_sign_out = confirm("Do you want to sign out account " + email + "? Account " + email + " and its data will be removed out of your device");
				if (confirm_sign_out == true){
					for (var index = 0; index < listAuthentication['authentication'].length; index++) {
					    var account = listAuthentication['authentication'][index];
					    if(account.email == email){
					       if (index > - 1){
					    	   //console.log("Remove")
					    	   listAuthentication['authentication'].splice(index, 1);
					    	   window.localStorage.setItem("AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
					       } 
					    } 
					}
					$state.go('landcover.accounts');
				} 
			} else {
				alert("Account " + email + " is sign out already !");
			}	
		} else {
			alert("Account is sign out already !");
		}
	};
}) 
// End Setting
/****************************************/
/** ListPlotsCtrl Controller **/
/****************************************/
.controller('List_LandInfo_Plots_Ctrl', function($scope,$state, $http, $ionicHistory,$ionicLoading) {
    function checkExist_LandCover_Record(plot){
		return false;
    }
	var email = window.localStorage.getItem('current_email');
	var recorder_name = email;
	console.log("LIST of " + email);
	var previous_page = window.localStorage.getItem("PREVIOUS_PAGE");
	
	/* Should be Processed Caching Data in HERE */
	$ionicLoading.show({
	      template: 'Loading LandInfo plots data...'
	});
	if (previous_page === "LOGIN_PAGE") {
	   console.log("1st Time After Login : get data from API - Refresh data - all data from Cloud");
	   $http.get('http://128.123.177.21:8080/query', {
			params : {
				action : "get",
				object : "landinfo",
				recorder_name : email,
				display : "",
				delimiter : ",",
				version : ""
			}
		}).success(function(data) {
	  		var LIST_PLOTS_SORTED = data;
	  		LIST_PLOTS_SORTED.sort(function(a, b){
	  		    	    if(getRealPlotName(email,a.name).toUpperCase().trim() < getRealPlotName(email,b.name).toUpperCase().trim()) return -1;
	  		    	    if(getRealPlotName(email,a.name).toUpperCase().trim() > getRealPlotName(email,b.name).toUpperCase().trim()) return 1;
	  		    	    return 0;
	  	    });
			
	       $scope.plots = LIST_PLOTS_SORTED;
	       for(var index = 0 ; index < $scope.plots.length; index ++){
				var plot = $scope.plots[index];
				if (checkExist_LandCover_Record(plot) == true){
					$scope.plots[index].img_src = "img/lpks_green_checkmark.png";
				} else {
					$scope.plots[index].img_src = "img/lpks_empty_checkmark.png";
				}
			}
	       
	       $ionicLoading.hide();
	       if($scope.plots.length === 0) {
	    	   window.localStorage.setItem("PREVIOUS_PAGE","LIST_PLOT_PAGE");
			   $state.go('landcover.main');
		   } else  {
			   var localPlots = JSON.stringify(data);	
			   window.localStorage.setItem(email + "_" + "LIST_LANDINFO_PLOTS", localPlots);
		   }
		}).error(function(err) {
			$ionicLoading.hide();
			alert(err.error);
		});
	    window.localStorage.setItem("PREVIOUS_PAGE","LIST_PLOT_PAGE");
	} else if (previous_page === "ADD_NEW_PLOT_SUCCESS") {
		
	} else {
		clearAllCache();
		/**********************/
		/* Syncing with Cloud */
		/**********************/
		//console.log("Caching & Syncing : Queyry API to check Are there any newplots in Cloud of this account ?");
		var areThereAnyNewPlots = false;
		
		if (areThereAnyNewPlots == false) {
		     //console.log("Caching & Syncing :  Get Data From Local Cache - NO NEWS");
		     $scope.plots = {};
		     //console.log(window.localStorage.getItem(recorder_name + "_" + "LIST_LANDINFO_PLOTS"));
		     var LIST_PLOTS =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_LANDINFO_PLOTS"));
		     
		     //console.log(LIST_PLOTS);
		      
		     /* Sort list of plot based on alphabet of plot_name */
		     if (LIST_PLOTS != null && LIST_PLOTS != 'undefined'){
		    	 if (LIST_PLOTS.length > 0){
				     var LIST_PLOTS_SORTED = LIST_PLOTS;
				     LIST_PLOTS_SORTED.sort(function(a, b){
				    	    if(getRealPlotName(email,a.name).toUpperCase().trim() < getRealPlotName(email,b.name).toUpperCase().trim()) return -1;
				    	    if(getRealPlotName(email,a.name).toUpperCase().trim() > getRealPlotName(email,b.name).toUpperCase().trim()) return 1;
				    	    return 0;
				     });
				     
				     $scope.plots = LIST_PLOTS_SORTED;
				     for(var index = 0 ; index < $scope.plots.length; index ++){
							var plot = $scope.plots[index];
							if (checkExist_LandCover_Record(plot) == true){
								$scope.plots[index].img_src = "img/lpks_green_checkmark.png";
							} else {
								$scope.plots[index].img_src = "img/lpks_empty_checkmark.png";
							}
					 }
				     
		    	 } else {
		    		 $scope.plots = "";
		    	 }   	 
		     } else {
		    	 $scope.plots = "";
		     }
		} else {
			/* Caching & Syncing : Query plots from Cloud that are not stored in Local Caching */
			//console.log("Caching & Syncing :  Query new plots in Cloud and update with Local Cache");
		}
		$ionicLoading.hide();
	}

    $scope.plotname = function(name){
		var str = name.length;
		var email = window.localStorage.getItem('current_email');
		var finalstr = getRealPlotName(email,name);
		return finalstr;
	};


	$scope.selectPlot = function(plot){
		$scope.selectedPlot = plot;
	};
	function clearAllCache() {
		console.log("Clear Cache");
		$ionicHistory.clearCache();
	}

}) // End ListPlotsCtrl

/****************************************/
/** LandCover SignIn Controller **/
/****************************************/
.controller('SignIn_Ctrl', function($scope, $state, $http,  $ionicHistory,$ionicLoading, $cordovaOauth) {
	/* Check source using*/
	var typeBrowser = getTypeWebBrowser();
	//typeBrowser = "DEVICE";
	//console.log(typeBrowser)
	if (typeBrowser == "DEVICE") {
		document.getElementById("loginGoogleDevice").style.display="block";
		document.getElementById("loginGoogleWebBrowser").style.display="none";
	} else {
		//console.log(document.getElementById("loginGoogleDevice").style.display);
		document.getElementById("loginGoogleDevice").style.display="none";
		document.getElementById("loginGoogleWebBrowser").style.display="block";
	}
	
	
	function checkExist(value, JSONArray){
		var hasMatch =false;
		for (var index = 0; index < JSONArray.length; index++) {
		    var auth = JSONArray[index];
		    if(auth.email == value){
		      hasMatch = true;
		      break;
		    }
		}
		return hasMatch;
	}
	
	function updateAuthExist(email,auth_key,JSONArray){
		for (var index = 0; index < JSONArray.length; index++) {
		    var auth = JSONArray[index];
		    if(auth.email == email){
		        JSONArray[index].json_auth_data = auth_key;
		    }
		}
	}

	function clearAllCache() {
		console.log("Clear Cache");
		$ionicHistory.clearCache();
		//$ionicHistory.clearHistory();
	}
	
	
	/* Test Login with Google Account */
	$scope.googleSignIn_Device = function() {
        $cordovaOauth.google("254673914223-tv4pvoig9ouql2puvsuigmiuabaj87u8.apps.googleusercontent.com", 
        		            ["https://www.googleapis.com/auth/urlshortener", 
        		             "https://www.googleapis.com/auth/userinfo.email"])
        .then(function(result) {
            var access_token = result.access_token;
            /* Request to get Email */
			$http({
			    method: 'GET',
			    url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token,
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		    }).success(
				function(data, status, headers, config) {
					var email = data.email;
					var password = data.id;
					var localData = result.access_token;
			    	var objAuth = window.localStorage.getItem("AUTHENTICATION_LIST");
					if (objAuth === null || objAuth === 'null'){
							var listAuthentication = { authentication : []};
							listAuthentication.authentication.push({
								"email" : email,
								"password" : password,
								"json_auth_data" : localData
							});
					} else {
							var listAuthentication = JSON.parse(objAuth);
							if (checkExist(email, listAuthentication['authentication']) == false){
								listAuthentication['authentication'].push({
									"email" : email,
									"password" : password,
									"json_auth_data" : localData
								});
							} else {
								console.log("Update");
								updateAuthExist(email,localData,listAuthentication['authentication']);
							}	
					}
					window.localStorage.setItem("current_json_auth_data", localData);
					window.localStorage.setItem("current_email",email);
					window.localStorage.setItem("current_password",password);

					window.localStorage.setItem("AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
					window.localStorage.setItem("PREVIOUS_PAGE","LOGIN_PAGE");
					$state.go('landcover.landinfo_plots');	
			}).error(function(err) {
		    	alert("Authentication Error ! Please re-try again");
		    });
        }, function(error) {
            console.log(error);
            alert("Authentication Error ! Please re-try again")
        });
    };
	
    /* Test Login with Google Account */
	$scope.googleSignIn_WebBrowser = function() {
		var params = {
			'clientid':'254673914223-tv4pvoig9ouql2puvsuigmiuabaj87u8.apps.googleusercontent.com',
			'cookiepolicy':'single_host_origin',
			'callback' : loginCallBack,
			'approvalprompt':'force',
			'scope' :'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
		};
		gapi.client.setApiKey("AIzaSyCUYSNGMdVkeinZik6YiCyAQcuI0vIqjZk");
		gapi.auth.signIn(params);
		
		function loginCallBack(result) {
			console.log(result);
			var email = "";
			var password = "";
			var localData = "";
			//console.log("ABC" + gapi.auth.getToken());
			console.log(result.status);
			if (result.status.google_logged_in === true){
				console.log("Access Token : " + result.access_token);
				/* Request to get Email */
				$http({
				    method: 'GET',
				    url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token,
				    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			    }).success(
					function(data, status, headers, config) {
						email = data.email;
						password = data.id;
					    localData = result.access_token;
				    	var objAuth = window.localStorage.getItem("AUTHENTICATION_LIST");
						if (objAuth === null || objAuth === 'null'){
								var listAuthentication = { authentication : []};
								listAuthentication.authentication.push({
									"email" : email,
									"password" : password,
									"json_auth_data" : localData
								});
						} else {
								var listAuthentication = JSON.parse(objAuth);
								if (checkExist(email, listAuthentication['authentication']) == false){
									listAuthentication['authentication'].push({
										"email" : email,
										"password" : password,
										"json_auth_data" : localData
									});
								} else {
									console.log("Update");
									updateAuthExist(email,localData,listAuthentication['authentication']);
								}	
						}
						window.localStorage.setItem("current_json_auth_data", localData);
						window.localStorage.setItem("current_email",email);
						window.localStorage.setItem("current_password",password);
	
						window.localStorage.setItem("AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
						window.localStorage.setItem("PREVIOUS_PAGE","LOGIN_PAGE");
						$state.go('landcover.landinfo_plots');	
				}).error(function(err) {
			    	alert("Authentication Error ! Please re-try again");
			    });
			} else {
				 alert(err.error,'Authentication Error ! Please re-try again');
			}
			
		};
    };
    
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }
}); 
// End Controller SignInCtrl