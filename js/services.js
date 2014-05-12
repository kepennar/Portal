
angular.module('portail-qualif.services', [])
.factory('Conf', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
	"use strict";
	var confs = {};
	var mode = $rootScope.mode;
	var getConf = function() {
		var deferredconf = $q.defer();
		if (confs[mode]) {
			deferredconf.resolve(confs[mode]); 
		} else {
			$http.get('data/confs.json').success(function(data) {
				confs =  data;
				deferredconf.resolve(confs[mode]);
			});
		}	
		return deferredconf.promise;	
	};

	return {
		conf: getConf
	};
}])
.factory('Links', ['$http', '$q', function($http, $q) {
	"use strict";

	var menus = [];
	var headers = [];
	
	var getMenus = function() {
		var deferredMenus = $q.defer();
		if (menus.length) {
			deferredMenus.resolve(menus); 
		} else {
			$http.get('data/menus.json').success(function(data) {
				menus = data;
				deferredMenus.resolve(data);
			});
		}	
		return deferredMenus.promise;	
	};
	var getHeaders = function() {
		var deferredheaders = $q.defer();
		if (headers.size) {
			deferredheaders.resolve(headers); 
		} else {
			$http.get('data/headerApps.json').success(function(data) {
				headers =  data;
				deferredheaders.resolve(data);
			});
		}	
		return deferredheaders.promise;	
	};
	var getMenuTypes = function() {
		var deferredMenu = $q.defer();
		getMenus().then(function(menus) {
			var datas = _(menus).map(mapMenuToMenuInfo);
			deferredMenu.resolve(datas);
		});
		return deferredMenu.promise;
	};
	var getMenuInfoById = function(id) {
		var deferredMenu = $q.defer();
		if (id === -1) {
			deferredMenu.resolve(null);	
		} else {
			getMenus().then(function(menus) {
				var datas = _(menus)
				.filter(function(menu) {
					return menu.menuId === id;
				})
				.map(mapMenuToMenuInfo);
				deferredMenu.resolve(datas[0]);
			});	
		}
		
		return deferredMenu.promise;
	};

	var mapMenuToMenuInfo = function(menu){
		return {
			menuId : menu.menuId,
			name: menu.name,
			icon : menu.icon     
		};
	};

	return {
		menus : getMenus(),
		headers : getHeaders(),
		menuTypes : getMenuTypes(),
		menuById: getMenuInfoById
	};
}])
.factory('Jenkins', ['$http', '$q', 'Conf', function($http, $q, Conf) {
	"use strict";
	var jenkinsUrl = null, hoursToShow = null, jenkinsUpdateInterval = null;
	
	var loadConf = function() {		
		return Conf.conf().then(function(conf) {
			jenkinsUrl = conf.jenkinsUrl;
			hoursToShow = conf.jenkinsIntervalToShow;
			jenkinsUpdateInterval = conf.jenkinsUpdateInterval;
		});
	};
	var getInterval = function() {
		return jenkinsUpdateInterval;
	};
	var consult = function() {
		var deferredJobs = $q.defer();

		var filteredJobs = [];
		var now = Date.now();
		var interval = 3600000 * hoursToShow;

		var defer = $q.defer();
		$http.get(jenkinsUrl + "/api/json?tree=jobs[name,description,url,lastCompletedBuild[timestamp]]")
		.then(function(result) {
			_(result.data.jobs).each(function(job) {
				if ((now - job.lastCompletedBuild.timestamp) < interval) {
					$http.get(jenkinsUrl + "/job/" + job.name + "/lastCompletedBuild/api/json").success(function(jobDatas) {
						jobDatas.name = job.name;
						jobDatas.description = job.description;
						jobDatas.configureUrl = job.url + "configure";
						filteredJobs.push(jobDatas);
						deferredJobs.notify("New Job");
					});
				}
			});
			deferredJobs.resolve(filteredJobs);
		});
		return deferredJobs;
	};

	return {
		init: loadConf,
		jobs : consult,
		interval : getInterval
	};
}])
.factory('Sonar', ['$http', '$q', 'Conf', function($http, $q, Conf) {
	"use strict";
	var sonarUrl;

	var loadConf = function() {		
		return Conf.conf().then(function(conf) {
			sonarUrl = conf.sonarUrl;
		});
	};

	var listApps = function() {
		var defferedApps = $q.defer();
		$http.get(sonarUrl + "/api/resources").success(function(data) {
			defferedApps.resolve(data);
		});
		return defferedApps.promise;
	};
	return {		
		init: loadConf,
		apps: listApps
	};
}]);