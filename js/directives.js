/* Directives */


angular.module('portail-qualif.directives', []).
  directive('favorite', ['Links', function(Links) {
	"use strict";

	var favoriteType = function($scope, link) {
		var id = link.menuId;
		Links.menuById(id).then(function(menuInfo) {
			var favoriteType = "";
			if (id === -1) {
				favoriteType = "btn-custom";
			} else if (id === 1) {
				favoriteType = "btn-success";
			} else if (id === 2) {
				favoriteType = "btn-warning";
			} else if (id === 3) {
				favoriteType = "btn-danger";
			} else if (id === 4) {
				favoriteType = "btn-primary";
			} else if (id === 5) {
				favoriteType = "btn-default";
			} else if (id === 6) {
				favoriteType = "btn-info";
			}
			$scope.favoriteType = favoriteType;
			if (menuInfo) {				
				$scope.icon = menuInfo.icon;
				$scope.menuName = menuInfo.name;
			} else {
				$scope.menuName = link.menuName;
			}
			
		});
		return favoriteType;
	};
	return {
	  restrict: 'E',
	  templateUrl: 'partials/directives/favorite.html',
	  link : function($scope, element, attrs) {
		favoriteType($scope, $scope.favorite);
	  }
	};
  }]).
  directive('job', ['Jenkins', function(Jenkins) {
	"use strict";

	var getJobBadge = function($scope, job) {
		var badge = "";
		var color = "";
		if (job.result === "SUCCESS") {
			badge = "fa-check";
			color = "success";
		} else if(job.result === "FAILURE"){
			badge = "fa-warning";
			color = "danger";
		} else if (job.building === true) {
			badge = "fa-cogs";
			color = "info";
		} else {
			badge = "fa-question";
		} 
		$scope.badge = badge;
		$scope.color = color;
	};
	
	return {
	  restrict: 'E',
	  replace: true,
	  templateUrl: 'partials/directives/job.html',
	  link : function($scope, element, attrs) {
		getJobBadge($scope, $scope.job);
	  }
	};
  }])
  .directive("typeaheadWatchChanges", function() {
	  return {
	    require: ["ngModel"],
	    link: function(scope, element, attr, ctrls) {
			scope.$watch(attr.ngModel, function(value) {
				ctrls[0].$setViewValue(value);
			});
	    }
	  };
	})
  ;