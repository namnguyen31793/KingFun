/**
 * Created by Nofear on 3/15/2019.
 */
//var InboxListData = require('InboxListData');

(function () {
    cc.InboxView = cc.Class({
        "extends": cc.Component,
        properties: {
            inboxTemp: cc.Node,
            

            contentPanel : require('InboxDetail'),
            InboxView_TinNhan  : require('InboxView_TinNhan'),
            InboxView_TinNhanHeThong  : require('InboxView_TinNhanHeThong'),
        },

        onLoad: function () {
            cc.InboxController.getInstance().setInboxView(this);
            this.animation = this.node.getComponent(cc.Animation);
            this.getInbox(1);
            
			
        },
		onEnable: function () {
            if(!this.animation)
                this.animation = this.node.getComponent(cc.Animation);
          this.animation.play('openPopup');
          var userMailCommand = new cc.UserMailCommand;
          userMailCommand.execute(this);
          this.contentPanel.node.active = false;
        },

        getInbox: function (index) {
         
        },

        inboxUnselect: function() {
           
        },

        inboxSetContent: function(title, desc) {
             this.contentPanel.show(desc);
        },

        onUserMailResponse: function (response) {
           
            var list = response.List;
            cc.log(list);
           this.InboxView_TinNhan.Setup(list,response,this);
           this.onClick_TinNhan();
        },

        onSystemMailResponseError: function (response) {
            this.lbInfo.string = '';
        },
        onClick_ThongBaoChung()
        {
            this.InboxView_TinNhan.node.active = false;
            this.InboxView_TinNhanHeThong.node.active = true;
          
        },
        onClick_TinNhan()
        {
            this.InboxView_TinNhan.node.active = true;
            this.InboxView_TinNhanHeThong.node.active = false;
        }

      
    });
}).call(this);
