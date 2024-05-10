/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var LoginFacebookCommand;

    LoginFacebookCommand = (function () {
        function LoginFacebookCommand() {
        }

        LoginFacebookCommand.prototype.execute = function (controller) {
            cc.LoginController.getInstance().setLoginType(cc.LoginType.Type2);

            var url = 'api/Account/Login'; //Login
            var params = {
                LoginType: cc.LoginType.Type2,
                //FBUserId: cc.FacebookController.getInstance().getFBUserId(),
                AccessToken: cc.FacebookController.getInstance().getFBAccessToken(),
                DeviceId: cc.ServerConnector.getInstance().getDeviceId(),
                DeviceType: cc.Config.getInstance().getDeviceType(),
            };


            if (controller.nodeCaptcha.active) {
                params.PrivateKey = cc.ServerConnector.getInstance().getCaptchaPrivateKey();
                params.Captcha = controller.captcha;
            }

            params = JSON.stringify(params);

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                if (obj.ResponseCode === 1) {
                    /*
                    {
                        "ResponseCode": 1,
                        "AccountInfo": {
                            "AccountID": 15364516,
                            "AccountName": "Player_15364516",
                            "AvatarID": 10,
                            "Balance": 10028442593,
                            "Status": "",
                            "Gender": -1,
                            "BirthDay": "0001-01-01T00:00:00",
                            "PhoneNumber": null,
                            "PendingMessage": 0,
                            "PendingGiftcode": 0,
                            "TotalWin": 0,
                            "TotalLose": 0,
                            "TotalDraw": 0,
                            "IsUpdateAccountName": false
                        }
                    }
                    * */
                    return controller.onLoginResponse(obj);
                } else {
                    return controller.onLoginResponseError(obj);
                    //cc.PopupController.getInstance().show(obj.Message, cc.PopupStyle.NOTHING);
                }
            }, true);
        };

        return LoginFacebookCommand;

    })();

    cc.LoginFacebookCommand = LoginFacebookCommand;

}).call(this);
