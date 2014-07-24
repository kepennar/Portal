/*jshint strict: true */

/* Controllers */

angular.module('portal.controllers', [])
	.controller('HeaderCtrl', ['$scope', 'Links', function($scope, Links) {
		"use strict";
		Links.headers().then(function(headers) {
			$scope.headerApps = headers;
		});

	}])
	.controller('MenuLeftCtrl', ['$scope', 'Links', function($scope, Links) {
		"use strict";
		Links.menus().then(function(menus) {
			$scope.menus = menus;
		});		

		$scope.$watch('filter', function() {
			_.each($scope.menus, function(menu) {
				menu.isCollapsed = false;
			});
		});
	}])
	.controller('FavoritesCtrl', ['$scope', '$modal',  function($scope, $modal) {
		"use strict";
		$scope.favorites= angular.fromJson(localStorage.favorites);
		$scope.editMode = false;
		
		if (!$scope.favorites) {
			$scope.favorites = [];
		}
		$scope.addCustomFavorite=function() {
			var modalInstance = $modal.open({
				controller : 'FavoriteModalCtrl',
				templateUrl: 'partials/modals/addCustomFavorite.html'
			});
			modalInstance.result.then(function (customFavorite) {
				$scope.favorites.push(customFavorite);
				localStorage.favorites = angular.toJson($scope.favorites);
			});
		};
		$scope.removeFavorite = function(favorite, $event) {
	
			$scope.favorites = _($scope.favorites).without(favorite);
			localStorage.favorites = angular.toJson($scope.favorites);
			if ($event.stopPropagation) {
				$event.stopPropagation();
			}
			if ($event.preventDefault) {
				$event.preventDefault();
			}
			$event.cancelBubble = true;
			$event.returnValue = false;			
		};
		$scope.eraseFavorites = function() {
			localStorage.favorites = angular.toJson([]);
			$scope.favorites = [];
		};
		$scope.dropCallback = function (event, ui, favorites) {
		  localStorage.favorites = angular.toJson(favorites);
		};

	}])
	.controller('FavoriteModalCtrl', ['$scope', '$modalInstance', 'Links', function($scope, $modalInstance, Links) {
		"use strict";
		$scope.customLink = {};

		Links.menuTypes().then(function(menuTypes) {
			$scope.types = menuTypes;
		});
		$scope.ok = function () {
			var menuId = -1, menuName= '';
			// If an existing menu has been selected
			if ($scope.customLink.type.menuId) {
				menuId = $scope.customLink.type.menuId;
				menuName = $scope.customLink.type.name;
			} else {
				menuName = $scope.customLink.type;
			}

			var favorite = {
				name: $scope.customLink.name,
				href: $scope.customLink.href,
				menuId: menuId,
				menuName: menuName
			};
			$modalInstance.close(favorite);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	.controller('JenkinsCtrl', ['$scope', '$interval', 'Jenkins', function($scope, $interval, Jenkins) {
		"use strict";
		$scope.isCollapsed = false;
		var stop;

		var getJobsResults = function() {
			Jenkins.jobs().then(function(jobs) {
				$scope.jobs= jobs;				
			});
		};
		var startRequests = function() {
			if ( angular.isDefined(stop) ) {
				return;
			}
			getJobsResults();
			stop = $interval(getJobsResults, Jenkins.interval());
		};
		var stopRequests = function() {
			if (angular.isDefined(stop)) {
				$interval.cancel(stop);
				stop = undefined;
			}
		};
		
		$scope.$watch('isCollapsed', function (newVal) {
			if (newVal) {
				stopRequests();
			} else {
				startRequests();
			}
		});

		$scope.$on('$destroy', function() {
			stop();
		});

		
	}])
	.controller('SonarCtrl', ['$scope', '$modal', 'Sonar', function($scope, $modal, Sonar) {
		"use strict";
		
		$scope.apps = [];
		Sonar.apps().then(function(apps) {
			$scope.apps = apps;
		});

		$scope.openSonarApp = function(app) {
			var modalInstance = $modal.open({
				controller : 'SonarModalCtrl',
				resolve: {
					app: function () { 
						return app; 
					}
				},
				templateUrl: 'partials/modals/sonarAnalysis.html'
			});
		};
	}])
	.controller('SonarModalCtrl', ['$scope', '$modalInstance', 'app', function($scope, $modalInstance, app) {
		"use strict";
		$scope.app = app;
	}])
	.controller('FeedsCtrl', ['$scope', '$modal', 'Feeds', function($scope, $modal, Feeds) {
		"use strict";
		var setFeedsUrls = function(urls) {
			$scope.feedsUrls = urls;
			localStorage.feedsUrls = angular.toJson($scope.feedsUrls);
		};
		
		$scope.feeds = []
		, $scope.editMode= false
		, $scope.feedsUrls = angular.fromJson(localStorage.feedsUrls);
		if(!$scope.feedsUrls) {
			setFeedsUrls(Feeds.defaultFeeds());
		}
		Feeds.feeds($scope.feedsUrls).then(function(feeds) {
			$scope.feeds = feeds;
		});
		

		$scope.edit = function() {
			$scope.editMode = ! $scope.editMode;
			if ($scope.editMode) {
				var modalInstance = $modal.open({
					controller : 'FeedsModalCtrl',
					resolve: {
						urls : function() {
							return $scope.feedsUrls;
						}
					},
					templateUrl: 'partials/modals/editFeedsUrls.html'
				})
				.result.then(function(urls) {
					setFeedsUrls(urls);
				});
			}
		};
		
	}])
	.controller('FeedsModalCtrl', ['$scope', '$modalInstance', 'urls', function($scope, $modalInstance, urls) {
		"use strict";
		$scope.urls = urls;

		$scope.delete = function(url) {
			$scope.urls = _($scope.urls).without(url);
		};

		$scope.ok = function() {
			$modalInstance.close($scope.urls);
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);