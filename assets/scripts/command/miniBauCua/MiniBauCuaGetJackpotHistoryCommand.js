(function () {
    var MiniBauCuaGetJackpotHistoryCommand;
  
    MiniBauCuaGetJackpotHistoryCommand = (function () {
      function MiniBauCuaGetJackpotHistoryCommand() {}
  
      MiniBauCuaGetJackpotHistoryCommand.prototype.execute = function (controller) {
        var url = "api/MiniBauCua/GetJackpotHistory";
  
        return cc.ServerConnector.getInstance().sendRequest(
          cc.SubdomainName.MINI_BAUCUA,
          url,
          function (response) {
            var obj = JSON.parse(response);
            return controller.onMiniBauCuaGetJackpotHistoryResponse(obj);
          }
        );
      };
  
     
  
      return MiniBauCuaGetJackpotHistoryCommand;
    })();
  
    cc.MiniBauCuaGetJackpotHistoryCommand = MiniBauCuaGetJackpotHistoryCommand;
  }.call(this));
  