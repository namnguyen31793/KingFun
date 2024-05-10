/**
 * Created by Nofear on 3/15/2019.
 */

 (function () {
    cc.MomoView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeActive: cc.Node,
            nodeDeActive: cc.Node,
            nodeDeForm:cc.Node,
            lbMoMoName: cc.Label,
            lbMoMoPhone: cc.Label,
            lbMoMoContent: cc.Label,
            lbMoMoContent2: cc.Label,
			Qrcode: cc.Sprite,
            lbMoMos: [cc.Label],
            lbCoins: [cc.Label],

            nodeRates: [cc.Node],
            lbColCoin: cc.Label,
            lbRule: cc.Label,
            editBoxMenhGia: cc.EditBox,
        },

        onLoad: function () {
            this.lbColCoin.string = cc.Config.getInstance().currency() + ' nhận';
            this.lbRule.string = 'Lưu ý:\n' +
                '- Nhập SAI: Số điện thoại, nội dung chuyển khoản sẽ không nhận\n' +
                'được ' + cc.Config.getInstance().currency() + '\n' +
                '- Chỉ chuyển khoản tối thiểu 10.000.\n' +
                '- Kiểm tra nội dung chuyển khoản trước khi thực hiện chuyển khoản.\n' +
                '- Hệ thống sẽ tự động cộng ' + cc.Config.getInstance().currency() + ' trong vòng 3 phút kể từ khi nhận \n' +
                'được tiền trong tài khoản MoMo';
            this._action = false;
                
        },
        onStart :function () {
            this._action = false;
             
            this.nodeActive.active = false;
            this.nodeDeForm.active = true;
            this.nodeDeActive.active =false;
        },
        onEnable: function () {
            this.nodeRates.forEach(function (nodeRate) {
                nodeRate.active = false;
            });
            this._action = false;
            // var response = {
            //     ResponseCode: 1,
            //     Orders: {
            //         Message: "MAX 15665119",
            //         WalletAccountName: "Nguyen Van Canh",
            //         WalletAccount: "0398665428",
            //         Rate: 1.15,
            //         List: [
            //             10000,
            //             20000,
            //             50000,
            //             100000,
            //             200000,
            //             500000,
            //             100000
            //         ]
            //     }
            // };

            // this.onGetListMomoResponse(response);

            // this.onGetListMomoResponseError(response);

          //  this.amountNap = 10000;

          //  var getListMomoCommand = new cc.GetListMomoCommand;
           // getListMomoCommand.execute(this);

            this.nodeActive.active = false;
            this.nodeDeForm.active = true;
            this.nodeDeActive.active =false;

        },

        onGetListMomoResponse: function (response) {
            this.lbMoMoName.string = response.Orders.WalletAccountName;
			this. Qrcode.string = response.Orders.List2.qr_url;
            this.lbMoMoPhone.string = response.Orders.WalletAccount;
            this.lbMoMoContent.string = response.Orders.Message;
			this.lbMoMoContent2.string = response.Orders.Message;

            var UrlQrcode = response.Orders.List2.qr_url;
            var self = this;
            var index = 0;
				 var self = this;
                  cc.loader.load({url: UrlQrcode, type: 'png', width: 256, height: 256 }, function (err, tex) {
                if (self.Qrcode !== null) {
                    self.Qrcode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
             }
			});
            
            if(this._action){
                this.nodeActive.active = true;
                this.nodeDeActive.active = false;
                this.nodeDeForm.active = false;
            }else{
                this.nodeActive.active = false;
                this.nodeDeActive.active = false;
                this.nodeDeForm.active = true;
            }
           
        },

        onGetListMomoResponseError: function (response) {
            this.nodeActive.active = false;
            this.nodeDeForm.active = false;
            this.nodeDeActive.active = true;
        },

        copyMoMoAccountClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbMoMoPhone.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyMoMoContentClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbMoMoContent.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        napTien: function (event) {
            this._action = true;
            //this.amountNap = cc.Tool.getInstance().removeDot(this.editBoxMenhGia.string);
			this.amountNap = "500000";
            var getListMomoCommand = new cc.GetListMomoCommand;
            getListMomoCommand.execute(this);
            
           this.nodeActive.active = true;
           this.nodeDeForm.active = false;
        },
        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxMenhGia.string);
            this.editBoxMenhGia.string = cc.Tool.getInstance().formatNumber(val);
           // this.lbValueTransfer.string = 'Số ' + cc.Config.getInstance().currency() + ' cần chuyển: ' + this.editBoxMenhGia.string;
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxMenhGia.string);
            this.editBoxMenhGia.string = cc.Tool.getInstance().formatNumber(val);
           //this.lbValueTransfer.string = 'Số ' + cc.Config.getInstance().currency() + ' cần chuyển: ' + this.editBoxMenhGia.string;
        },

    });
}).call(this);
