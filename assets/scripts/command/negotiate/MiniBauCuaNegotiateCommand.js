/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var MiniBauCuaNegotiateCommand;

    MiniBauCuaNegotiateCommand = (function () {
        function MiniBauCuaNegotiateCommand() {
        }

        MiniBauCuaNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.MINI_BAUCUA, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onMiniBauCuaNegotiateResponse(obj);

            }, true);
        };

        return MiniBauCuaNegotiateCommand;

    })();

    cc.MiniBauCuaNegotiateCommand = MiniBauCuaNegotiateCommand;

}).call(this);
