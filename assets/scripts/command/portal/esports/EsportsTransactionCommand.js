/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var EsportsTransactionCommand;
    EsportsTransactionCommand = (function () {
        function EsportsTransactionCommand() {
        }
        EsportsTransactionCommand.prototype.execute = function (controller) {

            var url = '';
            var params;
            var fundType;

            if(controller.type == "Withdrawal"){
                url = 'api/Account/FundTransfer' 
                fundType = 2;
            }else{
                url = 'api/Account/FundTransfer'
                fundType = 1;
            }

            params = JSON.stringify({
                Amount : controller.amount,
                Wallet : controller.wallet,
                FundType: fundType,
                ProductType: cc.TCGAMINGID
            });

            console.log(url, params);
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onTransactionResponse(obj);
                } else {
                    return controller.onTransactionResponseError(obj);

                }
            });
        };
        return EsportsTransactionCommand;

    })();
    cc.EsportsTransactionCommand = EsportsTransactionCommand;
}).call(this);
