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

.controller('homeCtrl', function($scope,$rootScope,$q,$http,$state,md5) {

  localStorage.setItem("enJuego",0);

})

.controller('listajuegosCtrl', function($scope,$q,$http,$state,$rootScope,$location, md5) {
  $scope.buscarjuegosservice=function(){

    try {
      var q = $q.defer();
      $http.get($rootScope.baseURL+"7&player="+localStorage.getItem("id")).success(function(data){
        q.resolve(data);
      });
      return q.promise;

    }
    catch(err) {
    }
  };

  $scope.buscarjuegos = function(){
    $scope.juegos = $scope.buscarjuegosservice();
    $scope.juegos.then(function(val){
      $scope.temporal=val;
      console.log($scope.temporal);  
      $scope.juegos = $scope.temporal;

    });
    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.buscarjuegos();

  $scope.unirPartidaService = function(juegoId){

    try {
      var q = $q.defer();
      $http.get($rootScope.baseURL+"4&player="+localStorage.getItem("id")+"&board="+juegoId).success(function(data){
        q.resolve(data);
      });
      return q.promise;

    }
    catch(err) {

    }
  }

  $scope.unirseApartida = function(boardid){
    console.log(boardid);           
    $scope.partida = $scope.unirPartidaService(boardid);
    $scope.partida.then(function(val){
      //se almacena board en local storage, se redirije a juego
      localStorage.setItem("board",val.tbl_board_id);
      localStorage.setItem("enJuego", 1);
      $location.path('/app/nuevojuego');


    });
  }

})
.controller('nuevojuegoCtrl', function($scope,$rootScope,$q,$http,$timeout) {
  localStorage.setItem("currentPlayer",'O');
  setPlayer();
  $scope.player = localStorage.getItem("Player");
  $scope.currentPlayer = localStorage.getItem("currentPlayer");

  $scope.ganador;
  $scope.winner = null;
  $scope.board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
  ];  
  
    //metodos tomados de http://jsfiddle.net/thai/8Gsyr/
    $scope.cell = function(row, column) {
      return $scope.board[row][column];
    }
    $scope.cellText = function(row, column) {
      var value = $scope.cell(row, column);
      if(value == null) value="-";
      
      return value;
    }
    function getBoardIdService(){
      try {
        var q = $q.defer();
        $http.get($rootScope.baseURL+"9&player="+localStorage.getItem("id")).success(function(data){
          q.resolve(data);
        });
        return q.promise;

      }
      catch(err) {
      }
    };
    $scope.crearPartidaService = function(){
     try {
      var q = $q.defer();
      $http.get($rootScope.baseURL+"3&id="+localStorage.getItem("id")).success(function(data){
        q.resolve(data);
      });
      return q.promise;
      
    }
    catch(err) {
    }
    return true;
  };
  $scope.crearPartida= function(){
    $scope.partidaNueva = $scope.crearPartidaService();
    $scope.partidaNueva.then(function(val){
      //se almacena board en local storage, se redirije a juego
      console.log(JSON.stringify(val));

      // localStorage.setItem("board",val.tbl_board_id);
      // localStorage.setItem("enJuego", 1);
      // $location.path('/app/nuevojuego');
    });
  };


  if (localStorage.getItem("enJuego") == 0) {
    console.log("creando Juego nuevo");

    $scope.partida = $scope.crearPartida();
    getBoardIdService().then(function(data){

      console.log(JSON.stringify(data));
      var tableId = data[data.length-1].tbl_board_id;
      console.log("Board id "+ tableId);
      localStorage.setItem("board",tableId);

    });
  }
  function getPlayerOne(){
    getBoardIdService().then(function(data){
        //asumiendo que en el last esta el que sigue
        var tableId = data[data.length-1].tbl_board_player1;
        localStorage.setItem("PlayerOne",tableId);
        console.log("player 1 is"+ tableId);
        console.log("my id is" + localStorage.getItem("id"));
      });
  };
  function setPlayer(){
      //se llama desde antes del new game o cuando viene de encontrar partida
      getBoardIdService().then(function(data){
        //asumiendo que en el last esta el que sigue
        var tableId = data[data.length-1].tbl_board_player1;
        localStorage.setItem("PlayerOne",tableId);
        console.log("player 1 is "+ tableId);
        console.log("my id is " + localStorage.getItem("id"));
        var p1 = localStorage.getItem("PlayerOne") * 1;
        var myid = localStorage.getItem("id") * 1;
        if( p1 == myid){
          $scope.player = 'O';
          console.log("si es igual!");
        }else{
          $scope.player = 'X';
          console.log("no es igual!");
        }
        localStorage.setItem("Player", $scope.player);
        return $scope.player;
      });

    }
    posToMatrix = function (position){
      var pos=[0,0];      
      position=position*1;
      switch(position){
        //fila, col
        case 1: pos[0]=0; pos[1]=0; break;
        case 2: pos[0]=0; pos[1]=1; break;
        case 3: pos[0]=0; pos[1]=2; break;
        case 4: pos[0]=1; pos[1]=0; break;
        case 5: pos[0]=1; pos[1]=1; break;
        case 6: pos[0]=1; pos[1]=2; break;
        case 7: pos[0]=2; pos[1]=0; break;
        case 8: pos[0]=2; pos[1]=1; break;
        case 9: pos[0]=2; pos[1]=2; break;
        default: alert("Ingrese un valor correcto");
      }
      return pos;
    }
    switchPlayer = function(){
      console.log($scope.currentPlayer +" "+ $scope.player);
      if($scope.currentPlayer == 'O'){
        $scope.currentPlayer = 'X';
        console.log($scope.currentPlayer);
      }else{
        $scope.currentPlayer='O';
      } 
    }

    getCurrent = function(){
      getBoardIdService().then(function(data){
        //asumiendo que en el last esta el que sigue
        var tableId = data[data.length-1].tbl_board_last;
        console.log("current player "+ tableId);
        localStorage.setItem("currentPlayer",tableId);

      });
    }


    setPos = function(row,col,position){
      $scope.board[row][col]=$scope.player;
      $scope.setPosService(position)
      .then(function(data){
        console.log(JSON.stringify(data));
      });
      getCurrent();
      switchPlayer();
    }

    $scope.testPos = function(position){
      if($scope.player == $scope.currentPlayer){ 
        var row = posToMatrix(position)[0];
        var col = posToMatrix(position)[1];
        if($scope.board[row][col]==null){
          setPos(row,col,position);
        }else{
          alert("posicion ocupada.");
        }
      }else{
        alert("no es su turno.");
      }
    } 
    $scope.setPosService = function(position){

      try {
        var q = $q.defer();
        $http.get($rootScope.baseURL+"5&player="+localStorage.getItem("id")+"&position="+position+"&board="+localStorage.getItem("board")).success(function(data){
          q.resolve(data);
        });
        return q.promise;

      }
      catch(err) {
      }
    }


  });


















