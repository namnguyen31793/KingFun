/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var EsportsAccountInfoCommand;
    EsportsAccountInfoCommand = (function () {
        function EsportsAccountInfoCommand() {
        }
        EsportsAccountInfoCommand.prototype.execute = function (controller) {
//            var url = 'api/Esports/GetAccountInfo';
            var url = 'api/Account/GetBalance2';

            var params = JSON.stringify({
              ProductType: cc.TCGAMINGID,
            });

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onGetAccountInfoResponse(obj);
                } else {
                    return controller.onGetAccountInfoResponseError(obj);

                }
            });
        };
        return EsportsAccountInfoCommand;

    })();
    cc.EsportsAccountInfoCommand = EsportsAccountInfoCommand;
}).call(this);
