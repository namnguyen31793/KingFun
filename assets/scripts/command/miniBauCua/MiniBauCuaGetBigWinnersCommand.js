(function () {
    var MiniBauCuaGetBigWinnersCommand;
  
    MiniBauCuaGetBigWinnersCommand = (function () {
      function MiniBauCuaGetBigWinnersCommand() {}
  
      MiniBauCuaGetBigWinnersCommand.prototype.execute = function (controller) {
        var url = "api/MiniBauCua/GetBigWinner";
  
        return cc.ServerConnector.getInstance().sendRequest(
          cc.SubdomainName.MINI_BAUCUA,
          url,
          function (response) {
            var obj = JSON.parse(response);
            return controller.onMiniBauCuaGetBigWinnersResponse(obj);
          }
        );
      };
  
     
  
      return MiniBauCuaGetBigWinnersCommand;
    })();
  
    cc.MiniBauCuaGetBigWinnersCommand = MiniBauCuaGetBigWinnersCommand;
  }.call(this));
  