
cc.Class({
    extends: require("SlotNetwork"),
    onLoad()
    {
        require("SlotNetworkManager").getIns().Set_NetworkInstance(cc.RoomController.getInstance().getGameId(),this);
    },
    ResponseServer(code, packet) {
       
        require("Tw_SpinController").getIns().ResponseNetwork(code, packet);
    },


});
