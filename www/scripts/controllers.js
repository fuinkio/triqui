angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$rootScope,$q,$http,md5,$rootScope,$state,$ionicHistory) {
  $rootScope.baseURL="http://10.131.137.200/reto1controller/dataAccess.php?op=";
  // Form data for the login modal
   if(localStorage.getItem("id")){
    $scope.visible=false;
  }else{
    $scope.visible=true; 
  }
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() { 
     localStorage.removeItem("id");
     $scope.visible=true; 

     $ionicHistory.nextViewOptions({
        disableBack: true
     });
     $scope.loginData = {};
     $state.go('app.home'); 
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $rootScope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
   $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $scope.resultado = $scope.loginService();
    $scope.resultado.then(function(val){

      if(val){        
        $scope.visible=false;   
        $scope.closeLogin();
        localStorage.setItem("id",val);
        $state.go($rootScope.toState);
      }

    });
  };

$scope.loginService=function(){
      
    var q = $q.defer();
    $scope.loginData.password = md5.createHash($scope.loginData.password || '');
   console.log($rootScope.baseURL+"1&user="+$scope.loginData.correo+"&pass="+$scope.loginData.password);
    $http.get($rootScope.baseURL+"1&user="+$scope.loginData.correo+"&pass="+$scope.loginData.password).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  };

})






.controller('registrarmeCtrl', function($scope,$q,$http,$state,$rootScope,md5,$ionicHistory) {
  
$scope.registrarme=function(){

    try {
      $correo=$scope.nuevousuario.correo;
      $pass=md5.createHash($scope.nuevousuario.pass || '');                 
      

if($pass!=""&&$correo!=""){
    

    var q = $q.defer();
    $http.get($rootScope.baseURL+"2&user="+$correo+"&pass="+$pass).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  }else{
    alert("campos incompletos");
  }
 
}
catch(err) {
  alert("campos incompletos");
}

};
 
 $scope.llamarRegistrarme=function(){

$scope.act = $scope.registrarme();
    $scope.act.then(function(val){
      alert("registro exitoso"+" "+$correo);
      $scope.nuevousuario.correo="";
      $scope.nuevousuario.pass="";
      $pass="";
      $ionicHistory.nextViewOptions({
        disableBack: true
     });
      $state.go('app.home');
     });
 


 };





})


.controller('homeCtrl', function($scope,$q,$http,$state,$rootScope,md5) {
  


})

.controller('listajuegosCtrl', function($scope,$q,$http,$state,$rootScope,md5) {


})
.controller('nuevojuegoCtrl', function($scope,$q,$http,$state,$rootScope,md5) {


})

;


















