
angular.module('portail-qualif', [
    'ui.bootstrap',
    'ui.utils',
    'ui.router',
    'ngRoute',
    'ngAnimate',
    'ngDragDrop',
    'portail-qualif.controllers',
    'portail-qualif.services',
    'portail-qualif.directives'
]);

angular.module('portail-qualif')
  .provider('JenkinsInitializer', function () {
    this.$get = function (Jenkins) {
        return Jenkins.init();
    };
  })
  .provider('SonarInitializer', function () {
    this.$get = function (Sonar) {
        return Sonar.init();
    };
  });

angular.module('portail-qualif').config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $urlRouterProvider
    .otherwise('/home');

    $stateProvider
        .state('home', {
          url: '/home',
          views: {
            'headerView': { templateUrl: 'partials/headerApps.html', controller: 'HeaderCtrl'},
            'menuLeftView': { templateUrl: 'partials/menuLeft.html', controller: 'MenuLeftCtrl'},
            'favoritesView': { templateUrl: 'partials/favorites.html', controller: 'FavoritesCtrl'},
            'jenkinsView': { templateUrl: 'partials/jenkins.html', controller: 'JenkinsCtrl', resolve: {init : 'JenkinsInitializer'}},
            'sonarView': { templateUrl: 'partials/sonar.html', controller: 'SonarCtrl', resolve: {init : 'SonarInitializer'}},
            'feedsView': { templateUrl: 'partials/feeds.html', controller: 'FeedsCtrl', resolve: {init : 'SonarInitializer'}}
          }
        });

    

});

angular.module('portail-qualif').run(function($rootScope) {
    $rootScope.mode = 'dev';
    
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
