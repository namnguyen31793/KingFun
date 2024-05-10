cc.Class({
    ctor() {
        this.info = null;
        this.lastInfo = null;
        this.TotalScore = 0;
        this.RankId = 0;
        
    },
    extends: cc.Component,

    properties: {
        imgAva : cc.Sprite,
        lbRank : require("TextJackpot"),
        lbName : cc.Label,
        lbScore : require("TextJackpot"),
        top1: cc.Node,
        effectRun : cc.Node,
    },

    SetInfo(info, isMe) {
        this.info = info;
        this.lbName.string = "-";
        this.node.active = true;
        if(info == null) {
            this.lbRank.node.getComponent(cc.Label).string = "-";
            this.lbName.string = "-";
            this.lbScore.node.getComponent(cc.Label).string = "-";
        } else {
            this.lbRank.node.getComponent(cc.Label).string = info.RankId;
            this.RankId = info.RankId;
            if(info.Nickname == null)
                info.Nickname = "-";
                this.lbName.string = Global.Helper.formatName(info.Nickname);
            this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(info.TotalScore);
            Global.Helper.GetAvataOther(this.imgAva, info.Nickname);
        }
        if(isMe) {
            this.lbName.string = Global.Helper.formatName(cc.LoginController.getInstance().getNickname());
            Global.Helper.GetAvata(this.imgAva);
        }
    },

    SetFake(rank, listTop, scoreCheck, isUp, listRandomName, isCoppy = false) {
        try {
            if(scoreCheck == null)
            scoreCheck = 0;
            this.RankId = rank;
            if(rank <= listTop.length) {
                if(rank > 0) {
                    this.lbRank.node.getComponent(cc.Label).string = rank.toString();
                    this.lbName.string = Global.Helper.formatName(listTop[rank-1].Nickname);
                    this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(listTop[rank-1].TotalScore);
                    this.TotalScore = listTop[rank-1].TotalScore;
                }
                
            } else {
                if(rank <= 3) {
                    this.lbRank.node.getComponent(cc.Label).string = "-";
                    this.lbName.string = "-";
                    this.lbScore.node.getComponent(cc.Label).string = "-";
                    this.TotalScore = 0;
                } else {
                    this.lbRank.node.getComponent(cc.Label).string = rank.toString();
                    let r = Global.RandomNumber(0,listRandomName.length-1);
                    let name = listRandomName[r];
                    this.lbName.string = Global.Helper.formatName(name);
                    if(isCoppy) {
                        this.TotalScore = scoreCheck;
                    } else {
                        if(isUp) {
                            this.TotalScore = scoreCheck + Global.RandomNumber(0,4) * 5;
                            if(this.TotalScore >= listTop[listTop.length-1].TotalScore) {
                                this.TotalScore = listTop[listTop.length-1].TotalScore;
                            }
                                
                        } else {
                            this.TotalScore = scoreCheck - Global.RandomNumber(0,4) * 5;
                            if(this.TotalScore < 0)
                                this.TotalScore = 0;
                        }
                    }
                    Global.Helper.GetAvataOther(this.imgAva, name);
                    this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(this.TotalScore);
                }
            }
        } catch {

        }
    },

    SetPointUpFake(scoreCheck, isUp) {
        if(isUp) {
            if(scoreCheck > this.TotalScore) {
                this.TotalScore = scoreCheck + Global.RandomNumber(0,4) * 5;
            } else {
                if(this.TotalScore - scoreCheck < 30) {
                    this.TotalScore = this.TotalScore + Global.RandomNumber(0,2) * 3;
                }
            }
        } else {
            let r = Global.RandomNumber(0,100);
            if(r < 80) {
                let score = this.TotalScore + Global.RandomNumber(0,2) * 3;
                if(score <= scoreCheck) {
                    this.TotalScore = score;
                }
            }
        }
        this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(this.TotalScore);
    },

    SetRankFake(rank) {
        this.RankId = rank;
        if(rank <= 0){
            this.lbRank.node.getComponent(cc.Label).string = "-";
            this.lbName.string = "-";
            this.lbScore.node.getComponent(cc.Label).string = "-";
        } else {
            
            this.lbRank.node.getComponent(cc.Label).string = rank.toString();
        }
        
    },

    MovePosition(pos) {
        try {
            if(this.lastInfo == null || this.lastInfo.RankId != this.info.RankId || this.lastInfo.TotalScore != this.info.TotalScore) {
                this.effectRun.active = true;
                this.scheduleOnce(()=>{
                    this.effectRun.active = false;
                } , 1);
            }
            if(this.info) {
                this.lbRank.StartIncreaseTo(this.info.RankId);
                this.lbScore.StartIncreaseTo(this.info.TotalScore);
                if(this.info.RankId != 1) {
                    this.top1.active = false;
                    this.lbRank.node.active = true;
                }
            }
            
            let acMove = cc.callFunc(() => {
                this.node.runAction(cc.moveTo(0.5, pos));
            });
            let acEnd = cc.callFunc(()=>{ 
                if(this.info) {
                    if(this.info.RankId == 1) {
                        this.top1.active = true;
                        this.lbRank.node.active = false;
                    } else {
                        this.top1.active = false;
                        this.lbRank.node.active = true;
                    }
                }
                
            });
            this.node.runAction(cc.sequence(acMove, cc.delayTime(0.5), acEnd));
            this.lastInfo = this.info;
        } catch {

        }
        
    },

    Move(distance) {
        this.node.y += distance;
    },

    Hide() {
        this.node.active = false;
    },

    
});
