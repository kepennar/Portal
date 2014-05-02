
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
		if (menus.size) {
			deferredMenus.resolve(menus); 
		} else {
			$http.get('data/menus.json').success(function(data) {
				menus =  data;
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
	var getMenuInfoById = function(id) {
		var deferredMenu = $q.defer();
		getMenus().then(function(menus) {

			var datas = _(menus)
			.filter(function(menu) {
				return menu.menuId === id;
			})
			.map(function(menu) {
				return {
					menuId : menu.menuId,
					name: menu.name,
					icon : menu.icon     
				};
			});
			deferredMenu.resolve(datas[0]);
		});
		return deferredMenu.promise;		
	};

	return {
		menus : getMenus(),
		headers : getHeaders(),
		menuById: getMenuInfoById
	};
}])
.factory('Jenkins', ['$http', '$q', 'Conf', function($http, $q, Conf) {
	"use strict";
	var jenkinsUrl = null, hoursToShow = null, loadedConf = false;
	var deferredConf = $q.defer();
	var upDeferred = $q.defer();

	var loadConf = function() {		
		Conf.conf().then(function(conf) {
			jenkinsUrl = conf.jenkinsUrl;
			hoursToShow = conf.jenkinsIntervalToShow;
			upDeferred.resolve(conf.jenkinsUpdateInterval);
			loadedConf = true;
			deferredConf.resolve(loadedConf);
		});
	};
	
	var consult = function() {
		var deferredJobs = $q.defer();
		if (!loadedConf) {
			loadConf();
			deferredConf.promise.then(function() {
				getJenkinsJobResult(deferredJobs);
			});
		} else {
			getJenkinsJobResult(deferredJobs);
		}
		return deferredJobs;
	};
	var getJenkinsJobResult = function(deferredJobs) {
		var defer = $q.defer();
		$http.get(jenkinsUrl + "/api/json?tree=jobs[name,description,url]").success(function(data) {
			defer.resolve(data.jobs);
		});

		var filteredJobs = [];
		var now = Date.now();
		var interval = 3600000 * hoursToShow;
		defer.promise.then(function(jobs) {
			_(jobs).each(function(job) {
				$http.get(jenkinsUrl + "/job/" + job.name + "/lastCompletedBuild/api/json").success(function(jobDatas) {
					if ((now - jobDatas.timestamp) < interval) {
						jobDatas.name = job.name;
						jobDatas.description = job.description;
						jobDatas.configureUrl = job.url + "configure";
						filteredJobs.push(jobDatas);
						deferredJobs.notify(filteredJobs);
					}
				});
			});
			deferredJobs.resolve(filteredJobs);
		});
		
	};
	loadConf();
	return {
		jobs : consult,
		interval : upDeferred.promise
	};
}]);