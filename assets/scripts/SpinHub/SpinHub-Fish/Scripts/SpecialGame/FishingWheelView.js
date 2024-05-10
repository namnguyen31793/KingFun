cc.Class({
    extends: require("FishingSpecialView"),
    ctor() {
        this.currentData = null;
        this.isPlay = false;
        this.indexRotation = 0;
        this.angle = 0;
        this.duration = 0;
        this.stateSpin = 0;
        this.targetAngle = 0;
        this.speed = 0;
        this.acceleration = 360;
        this.numbSpin = 0;
        this.nextTurnInfo = null;
        this.cacheActor = 0;
        this.cacheReward = 0;
        this.cacheAccountBalance = 0;
    },

    properties: {
        anim : cc.Animation,
        note : cc.Node,
        btnPlay : cc.Button,
        itemV1 : [cc.Label],
        itemV2 : [cc.Label],
        itemV3 : [cc.Label],
        animV1 : cc.Node,
        animV2 : cc.Node,
        animV3 : cc.Node,
        effectMoney : cc.Animation,
        animCoin : sp.Skeleton,
        lbMoney : cc.Label,
    },

    show(sittingId, nextInfoTurn, isStart = true) {
        this._super(sittingId);
        this.FillData(nextInfoTurn);
        if(this.isMain) {
            this.btnPlay.node.active = true;
        } else {
            this.btnPlay.node.active = false;
        }
        if(isStart) {
            this.anim.node.scale = 0;
            let pos = Global.Helper.GetPositionSliceBySittingIdAndMainSitting(sittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-282,-140));
            if(pos.y > 0) {
                this.anim.node.angle = 180;
            }
            this.anim.node.runAction(cc.sequence(cc.scaleTo(0.5, 1), cc.delayTime(0.5), cc.moveTo(0.5, pos), cc.delayTime(0.5),
                cc.callFunc(() => {
                    let callBack = ()=>{
                        if(this.isMain) {
                            this.isReady = true;
                            this.note.active = true;
                            this.scheduleOnce(()=>{
                                if(this.note.active) {
                                    this.ClickPlay();
                                }
                            } , 5);
                        } else {
                            this.note.active = false;
                        }
                        
                        this.anim.off("finished" , callBack);
                    }
                    this.anim.on("finished" ,callBack );
                    this.anim.play("ShowItemWheel"+this.numbSpin);
                    
                    })));
        } else {
            let callBack = ()=>{
                if(this.isMain) {
                    this.isReady = true;
                    this.note.active = true;
                    this.scheduleOnce(()=>{
                        if(this.note.active) {
                            this.ClickPlay();
                        }
                    } , 5);
                } else {
                    this.note.active = false;
                }
                
                this.anim.off("finished" , callBack);
            }
            this.anim.on("finished" ,callBack );
            this.anim.play("ShowItemWheel"+this.numbSpin);
        }
        
    },

    FillData(data) {
        this.currentData = data;
        if(data.length == 8) {
            this.numbSpin = 1;
            this.anim.play("StartWheel1");
            for(let i = 0; i < data.length; i++) {
                if(data[i] != 1) {
                    this.itemV1[i].string = "x"+data[i];
                }
            }
        } else if(data.length == 6) {
            this.numbSpin = 2;
            this.anim.play("StartWheel2");
            for(let i = 0; i < data.length; i++) {
                if(data[i] != 1) {
                    this.itemV2[i].string = "x"+data[i];
                }
            }
        } else if(data.length == 3) {
            this.numbSpin = 3;
            this.anim.play("StartWheel3");
            for(let i = 0; i < 3; i++) {
                if(data[i] != 1) {
                    this.itemV3[i].string = "x"+data[i];
                }
            }
        }
    },

    ClickPlay() {
        if(this.isReady) {
            this.isReady = false;
            this.note.active = false;
            let msgData = {};
            msgData [1] = Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE;
            require("SendRequest").getIns().MST_Client_Special_Fish_Play_Turn(msgData);
            // this.PlaySpin();

        }
    },

    PlaySpin(actor, reward, result, nextInfoTurnStr, accountBalance) {
        
        this.nextTurnInfo = JSON.parse(nextInfoTurnStr);
        this.cacheActor = actor;
        this.cacheReward = reward;
        this.cacheAccountBalance = accountBalance;
        this.stateSpin = 1;
        let data = result.split("|");
        let rs = parseInt(data[0]);
        let list = JSON.parse(data[1]);
        for(let i = 0; i < list.length; i++) {
            if(list[i] == rs) {
                this.indexReward = i;
                break;
            }
        }
        this.indexRotation = 3;
        this.targetAngle = this.indexReward * 360 / this.GetItemSpin();
    },

    GetCurrentSpin() {
        if(this.numbSpin == 1)
            return this.animV1;
        if(this.numbSpin == 2)
            return this.animV2;
        if(this.numbSpin == 3)
            return this.animV3;
    },

    GetItemSpin() {
        if(this.numbSpin == 1)
            return 8;
        if(this.numbSpin == 2)
            return 6;
        if(this.numbSpin == 3)
            return 3;
    },

    EndSpin() {
        if(this.cacheReward > 0) {
            this.scheduleOnce(()=>{
                this.lbMoney.string = Global.Helper.formatNumber(this.cacheReward);
                this.effectMoney.play();
                this.animCoin.node.active = true;
                this.animCoin.setAnimation(0, 'active', false);
            } , 1);
            this.scheduleOnce(()=>{             
                this.cacheActor.On_Attack();
                this.cacheActor.UpdateBalance(this.cacheReward, true);
                this.node.destroy();
            } , 4);
        } else {
            this.show(this.cacheActor.actorPropertis.SittingId, this.nextTurnInfo, false);
        }
    },

    update(dt) {
        if(dt < 1/60)
            dt = 1/60;
        if(this.stateSpin == 1) {
            this.speed += 360 * dt;
            this.angle += this.speed * dt;
            if(this.angle >= 360) {
                this.angle = 0;
                this.GetCurrentSpin().angle = 0;
                this.stateSpin = 2;
            }
        } else if(this.stateSpin == 2) {
            this.angle += this.speed * dt;
            if(this.angle >= 360) {
                this.angle -= 360;
                this.indexRotation -= 1;
                if(this.indexRotation == 0) {
                    this.stateSpin = 3;
                }
            }
        } else if(this.stateSpin == 3) {
            if(this.angle >= this.targetAngle)
                this.stateSpin = 4;
            this.angle += this.speed * dt;
            if(this.angle >= this.targetAngle)
                this.stateSpin = 4;
        } else if(this.stateSpin == 4) {
            this.speed -= 360*1.05 * dt;
            this.angle += this.speed * dt;
            if(this.speed <= 15) {
                this.stateSpin = 5;
            }
        } else if(this.stateSpin == 5) {
            this.angle += this.speed * dt;
            if(this.angle >= 360) {
                this.angle -= 360;
            }
            if( Math.abs(this.angle - this.targetAngle) <= 2) {
                this.stateSpin = 0;
                this.angle = this.targetAngle;
                this.EndSpin();
            }
        }
        if(this.GetCurrentSpin() != null)
            this.GetCurrentSpin().angle = this.angle;
        
    },
    
});
