cc.Class({
    extends: cc.Component,
    ctor(){
        this.cacheid = 0;
        this.useSpine = false;
        this.animationName = '';
        this.animationNameBG = '';
        this.isShowPreWin = false;
        this.ActionFire = null;
        this.skeletonFire = null;
        this.SlotUI = null;
        this.gem = null;
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
    },
    properties: {
        skeletonBG : sp.Skeleton,
        spriteIcons: cc.Sprite,
        skeleton : sp.Skeleton,
        bgWild : cc.Node,
    },

    SetSpineItem(slotUI, id, itemSpineData, itemSpineBGData, animationName = "", animationBgName = "", isGem = false, 
        skeletonFireDragon = null, action = null){

        this.useSpine = true;
        this.Reset();
        this.spriteIcons.node.active = true;
        if(slotUI.slotController.isFree)
            this.spriteIcons.spriteFrame = slotUI.itemImgDataFree[id-1];
        else
            this.spriteIcons.spriteFrame = slotUI.itemImgData[id-1];
        this.SlotUI = slotUI;
        this.cacheid = id;
        this.animationName = animationName
        this.animationNameBG = animationBgName

        this.skeleton.skeletonData = itemSpineData;
        if(!Global.Helper.isStringNullOrEmpty(animationName))
            this.skeleton.setAnimation(0, animationName, false);

        if(id != 2){
            this.skeletonBG.node.active = true;
            this.skeletonBG.skeletonData = itemSpineBGData;
            this.skeletonBG.setAnimation(0, "", false);
            this.skeletonBG.setToSetupPose();
            if(!Global.Helper.isStringNullOrEmpty(animationBgName))
                this.skeletonBG.setAnimation(0, animationBgName, false);
        }else{
            this.skeletonBG.node.active = false;
        }
        if(isGem)
            this.ShowGem();

        if(id == 1){
            if(slotUI.slotController.isFree){
                var o = this.color[slotUI.slotController.inputId_Free - 1];
                this.skeleton.node.color =  new cc.Color(o.r,o.g,o.b);
            }
            if(skeletonFireDragon){
                this.skeletonFire = skeletonFireDragon;
                skeletonFireDragon.parent = this.node;
                skeletonFireDragon.active = true;
                skeletonFireDragon.scale = 1;
                skeletonFireDragon.setPosition(cc.v2(0,-10));
                this.ActionFire = action;
            }
            this.bgWild.active = true;
        }
    },

    SetImageItem(slotUI, id, Sprite, isGem = false){
        this.useSpine = false;
        this.Reset();
        this.SlotUI = slotUI;
        this.cacheid = id;
        this.spriteIcons.node.active = true;
        this.spriteIcons.spriteFrame = Sprite;
        if(isGem){
            this.ShowGem();
        }
        if(id == 1){
            this.bgWild.active = true;
            if(slotUI.slotController.isFree){
                var o = this.color[slotUI.slotController.inputId_Free - 1];
                this.spriteIcons.node.color =  new cc.Color(o.r,o.g,o.b);
            }
        }
    },

    SetImageItemFake(id, Sprite){
        this.useSpine = false;
        this.Reset();
        this.spriteIcons.node.active = true;
        this.spriteIcons.spriteFrame = Sprite;

        if(id == 1)
            this.bgWild.active = true;
    },
    
    Reset(){
        if(this.gem){
            this.SlotUI.returnObjectToPool(this.gem );
            this.gem = null;
        }
        this.SlotUI = null;
        this.bgWild.active = false;
        this.skeleton.node.active = false;
        this.skeletonBG.node.active = false;
        this.spriteIcons.node.active = false;
        this.ActionFire = null;
        this.skeletonFire = null;
        this.skeleton.node.color = cc.Color.WHITE
        this.spriteIcons.node.color = cc.Color.WHITE
    },

    ShowGem(){
        let gem = this.SlotUI.poolFactory.getObject("Gem");
        this.gem = gem;   
        gem.parent = this.node;
        gem.active = true;
        gem.scale = 1;
        gem.setPosition(0,0);
    },
    SmallGem(){
        cc.tween(this.gem )
            .delay(0.7)
            .parallel(
                cc.tween().to(0.7, { scale: 0.4 }),
                cc.tween().to(0.7, { position: cc.v2(55, 50) })
            )
            .start();
    },

    HideColoritem(){
        // this.skeleton.node.color = cc.Color.GRAY;
        // this.spriteIcons.node.color = cc.Color.GRAY;
    },

    HideEffectEnd(){
        this.node.stopAllActions();
        if(this.ActionFire)
            this.ActionFire();
    },

    ActiveColorItem(isFree = false){
        if(this.useSpine){
            this.skeleton.node.active = true;
            this.spriteIcons.node.active = false;
            if(!Global.Helper.isStringNullOrEmpty(this.animationNameBG))
                this.skeletonBG.setAnimation(0, this.animationNameBG, false);
            if(!Global.Helper.isStringNullOrEmpty(this.animationName))
                this.skeleton.setAnimation(0, this.animationName, false);
            if(this.cacheid == 1){
                if(this.skeletonFire)
                    this.skeletonFire.getComponent(sp.Skeleton).setAnimation(0, this.animationName, false);
            }
        }else{
            if(!isFree){
                let fxScale_01 = cc.tween().to(0.2, { scale: 0.8 });
                let fxScale_02 = cc.tween().to(0.2, { scale: 1 });
                let fxScale = cc.tween().then(fxScale_01).then(fxScale_02);

                let actionX = cc.tween()
                    .repeat(2, fxScale)
                    .delay(1);

                cc.tween(this.node)
                    .then(actionX)
                    .start();
            } else {
                let tween = cc.tween()
                    .call(() => { this.spriteIcons.node.active = true; })
                    .delay(0.2) 
                    .call(() => { this.spriteIcons.node.active = false; }) 
                    .delay(0.2) 
                    .call(() => { this.spriteIcons.node.active = true; }) 
                    .delay(0.2)
                    .call(() => { this.spriteIcons.node.active = false; }) 
                    .delay(0.2) 
                    .call(() => { this.spriteIcons.node.active = true; })
                    .delay(0.2); 

                cc.tween(this.node)
                    .then(tween)
                    .start();
            }
        }
    },

    PlayAnimPreWin() {
        if(!this.isShowPreWin) {
            this.isShowPreWin = true;
            // this.node.getComponent(cc.Animation).play("StartPreWin");
        }
    },
    EndAnimPreWin() {
        this.isShowPreWin = false;
        // this.node.getComponent(cc.Animation).play("StopPreWin");
    },
});
