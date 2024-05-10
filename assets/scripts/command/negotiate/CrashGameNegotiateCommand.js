/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var CrashGameNegotiateCommand;

    CrashGameNegotiateCommand = (function () {
        function CrashGameNegotiateCommand() {
        }

        CrashGameNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CRASH_GAME, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onCrashGameNegotiateResponse(obj);

            }, true);
        };

        return CrashGameNegotiateCommand;

    })();

    cc.CrashGameNegotiateCommand = CrashGameNegotiateCommand;

}).call(this);
