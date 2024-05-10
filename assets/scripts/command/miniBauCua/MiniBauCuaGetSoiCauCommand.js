(function () {
    var MiniBauCuaGetSoiCauCommand;
  
    MiniBauCuaGetSoiCauCommand = (function () {
      function MiniBauCuaGetSoiCauCommand() {}
  
      MiniBauCuaGetSoiCauCommand.prototype.execute = function (controller) {
        var url = "api/MiniBauCua/GetSoiCau";
  
        return cc.ServerConnector.getInstance().sendRequest(
          cc.SubdomainName.MINI_BAUCUA,
          url,
          function (response) {
            var obj = JSON.parse(response);
            return controller.onMiniBauCuaGetSoiCauResponse(obj);
          }
        );
      };
  
     
  
      return MiniBauCuaGetSoiCauCommand;
    })();
  
    cc.MiniBauCuaGetSoiCauCommand = MiniBauCuaGetSoiCauCommand;
  }.call(this));
  