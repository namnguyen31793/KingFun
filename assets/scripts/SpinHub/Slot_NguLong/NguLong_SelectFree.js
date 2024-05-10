
cc.Class({
    extends: cc.Component,
    ctor(){
        this.isSend = false;
        this.slotController = null;
        this.color = [{
            r: 255,g: 255, b: 255
        }, {
            r: 255, g: 10,b: 0
        }, {
            r: 34,g: 36, b: 51
        }, {
            r: 0,g: 91, b: 255
        }, {
            r: 255,g: 210, b: 57
        }, {
            r: 21, g: 170, b: 0
        }, {
            r: 174,g: 0,b: 211
        }];
        this.positionFire  = [
                cc.v2(-477, -215),
                cc.v2(-350, -150),
                cc.v2(-210, -80),
                cc.v2(195, -120),
                cc.v2(340, -180),
                cc.v2(491, -230),
                cc.v2(0, 20)
            ];
        this.callBackFree = null;
        this.Selectid = 0;
    },

    properties: {
        listButton : [cc.Button],
        nodeButton : cc.Node,
        nodeAnim : cc.Node,
        animPhoenix : cc.Node,
        listDragon : [cc.Animation],
       
    },

    onLoad(){
        this.animPhoenix.getComponent(sp.Skeleton).setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'animation') {
                this.PlayCallBackFree();
             }
        });
    },

    Reset(){
        for(let i = 0; i < this.listButton.length; i++){
            this.listButton.interactable = true;
        }
        for(let i = 0; i < this.listDragon.length; i++){
            this.listDragon[i].play("IdleDragon"+(i+1));
        }
        this.nodeButton.active = true;
        this.Selectid = 0;
    },

    Show(slotController){
        this.Reset();
        this.slotController = slotController;
        this.nodeAnim.active = false;
        
        for(let i = 0; i < this.listButton.length; i++){
            this.listButton.interactable = true;
        }
        this.isSend = false;
        
        slotController.onIngameEvent("SHOWING_POPUP_FREE");
    },

    ClickSelectRooomFree(event, index){
        cc.log("ClickSelectRooomFree "+index);
        for(let i = 0; i < this.listButton.length; i++){
            this.listButton.interactable = false;
        }
        if(this.isSend)
            return;
        this.Selectid = index;
        this.isSend = true;
        this.listButton[index - 1].interactable = true;
        this.slotController.CallSelectRooomFree(index);
        var o = this.color[index - 1];
        this.animPhoenix.setPosition(this.positionFire[index - 1]);
        this.animPhoenix.scale = 0;
        this.animPhoenix.color = new cc.Color(o.r,o.g,o.b);
    },

    HandleResponseSelectRoomFree(slotController, freespinType, callback){
        cc.log("HandleResponseSelectRoomFree "+freespinType);
        this.callBackFree = callback;
        this.nodeAnim.active = true;

        var o = this.color[freespinType - 1];
        this.animPhoenix.color = new cc.Color(o.r,o.g,o.b);
        this.animPhoenix.setPosition(this.positionFire[freespinType - 1]);
        
        slotController.onIngameEvent("SLECT_INPUT_FREE");

        let anim = this.listDragon[freespinType-1].getComponent(cc.Animation);
        let callBack = ()=>{
            anim.off("finished" , callBack);
            this.AnimFire();
        }
        anim.on("finished" ,callBack );
        anim.play("Dragon"+freespinType);
    },

    AnimFire(){
        this.animPhoenix.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        this.animPhoenix.scale = 1;
        cc.tween(this.animPhoenix)
            .delay(0.15)
            .to(0.2, { position:  cc.v2(0, 0) })
            .start();

        this.scheduleOnce(()=>{
            this.callBackFree();
            this.nodeButton.active = false;
        } , 0.3);
    },

    PlayCallBackFree(){
        this.Hide();
    },

    Hide(){
        this.scheduleOnce(()=>{
            this.node.active = false;
        } , 0.5)
    },
});
