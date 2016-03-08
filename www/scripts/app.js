// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','angular-md5','ionic-datepicker','ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function ($rootScope) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
          if (requireLogin &&  !localStorage.getItem("tbl_sede_id") )  { 
      event.preventDefault();
      $rootScope.toState = toState;
     $rootScope.login();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
 .state('app.home', {
  cache: false,
    url: "/home",
    data: {
        requireLogin: false
      },
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'homeCtrl'
      }
    }
  })




.state('app.registrarme', {
      url: "/registrarme",
      data: {
        requireLogin: false
      },
      views: {
        'menuContent': {
          templateUrl: "templates/registrarme.html",
          controller: 'registrarmeCtrl'
        }
      }
    })


.state('app.listajuegos', {
      url: "/listajuegos",
      data: {
        requireLogin: true
      },
      views: {
        'menuContent': {
          templateUrl: "templates/listajuegos.html",
          controller: 'listajuegosCtrl'
        }
      }
    })

.state('app.nuevojuego', {
      url: "/nuevojuego",
      data: {
        requireLogin: true
      },
      views: {
        'menuContent': {
          templateUrl: "templates/nuevojuego.html",
          controller: 'nuevojuegoCtrl'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
