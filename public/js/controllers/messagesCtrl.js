roomApp.controller('MessagesCtrl', function($scope, ChatService) {
  $scope.messages = [];

  ChatService.subscribe(function(message) {
    $scope.messages.push({
      time: new Date(),
      content: message
    });
    $scope.$apply();
  });

  $scope.connect = function() {
    ChatService.connect();
  }

  $scope.send = function() {
    ChatService.send($scope.text);
    $scope.text = "";
  }

});

roomApp.factory('ChatService', function(){
  var service = {};

  service.connect = function() {
    if(service.ws) { return; }

    var ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = function() {
      service.callback("Succeeded to open a connection");
    };

    ws.onerror = function() {
      service.callback("Failed to open a connection");
    }

    ws.onmessage = function(message) {
      service.callback(message.data);
    };

    service.ws = ws;
  }

  service.send = function(message) {
    service.ws.send(message);
  }

  service.subscribe = function(callback) {
    service.callback = callback;
  }

  return service;
});
