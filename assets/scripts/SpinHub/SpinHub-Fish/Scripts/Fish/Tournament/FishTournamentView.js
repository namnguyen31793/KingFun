var SIZE = 126;
cc.Class({
    extends: cc.Component,
    ctor() {
        this.isSlot = true;
        this.slotView = null;
        this.countTime = 0;
        this.listTop = [];
        this.listPos = [];
        this.lastRank = -1;
        this.speed = 0;
        this.timeMove = 0;
        this.countTest = 0;
        this.mainScore = 0;

        this.c_listUser = null;
        this.c_currentFund = 0;
        this.c_endDate = null;
        this.c_userInfo = null;

        this.isFirst = true;
        this.listRandomName = [];
        this.isGetTopWin = false;
        this.posX = 0;
        this.currentPos = 2;
    },

    properties: {
        isRight : {
            default : true,
        },
        isCalPos : {
            default : true,
        },
        xMove : {
            default : 144,
        },
        content : cc.Node,
        lbPrize : require("TextJackpot"),
        lbTime : cc.Label,
        userInfo : require("FishUserTournamentView"),
        otherInfo : [require("FishUserTournamentView")],
        btnIn : cc.Node,
        btnOut : cc.Node,
    },

    Init(slotView) {
        this.slotView = slotView;
        require("SyncTimeControl").getIns().SendPing();
        let data = {};
		data[1] = this.slotView.slotType;
        require("SendRequest").getIns().MST_Client_Event_Tournament_Get_Current_Score(data);
    },

    InitFish() {
        this.isSlot = false;
        require("SendRequest").getIns().MST_Client_Get_Fish_Tournament_Get_Ranking ();
        require("SendRequest").getIns().MST_Client_Get_Fish_Tournament_Get_Top_Score ();
        this.schedule(() => {
            require("SendRequest").getIns().MST_Client_Get_Fish_Tournament_Get_Ranking ();
            require("SendRequest").getIns().MST_Client_Get_Fish_Tournament_Get_Top_Score ();
        }, 3);
       
    },

    SetInfo(listUser, userInfo, currentFund, startDate, endDate) {
        this.c_listUser = listUser;
        this.c_currentFund = currentFund;
        this.c_endDate = endDate;
        this.c_userInfo = userInfo;
        if(this.isFirst) {
            this.ShowInfo(listUser, userInfo, currentFund, endDate);
        }
    },

    PlayInfo() {
        if(this.isFirst) {
            this.isFirst = false;
        } else {
            if(this.c_listUser)
                this.ShowInfo(this.c_listUser, this.c_userInfo, this.c_currentFund, this.c_endDate);
        }
    },

    UpdateTime() {
        this.CalculatorTime(this.c_endDate);
    },

    CalculatorTime(endDate) {
        if(endDate == null)
            return;
        let lastCountTime = this.countTime;
        this.countTime = (endDate.getTime()-require("SyncTimeControl").getIns().GetCurrentTimeServer())/1000;
        if(this.countTime>0) {
            this.content.active = true;
            this.isCountTime = true;
        } else {
            this.content.active = false;
            if(lastCountTime > 0) {
                this.isGetTopWin = false;
                this.RequestGetTopWin();
            }
        }
    },

    ShowInfo(listUser, userInfo, currentFund, endDate) {
        this.content.active = true;
        this.lbPrize.StartIncreaseTo(currentFund);
        this.CalculatorTime(endDate);
        if(this.lastRank == -1) {
            for(let i = 0; i < this.otherInfo.length; i++) {
                this.otherInfo[i].SetInfo(null, false);
            }
        }
        if(listUser.length == 0) {
            this.userInfo.SetInfo(null, true);
        } else {
            this.listTop = listUser;
            let mainInfo = userInfo;
            if(mainInfo.NickName == cc.LoginController.getInstance().getNickname()) {
                this.mainScore = mainInfo.TotalScore;
                this.userInfo.SetInfo(mainInfo, true);
                if(mainInfo.RankId <= 3) {
                    for(let i = 0; i < 3; i++) {
                        this.otherInfo[i+1].SetFake(i+1,this.listTop, mainInfo.TotalScore, true, this.listRandomName);
                    }
                    for(let i = 0; i < listUser.length; i++) {
                        if(i < 3) {
                            this.otherInfo[i+1].SetInfo(listUser[i], false);
                        }
                    }
                    if(mainInfo.RankId == 3) {
                        this.currentPos = 3;
                        this.SetFakeRank(mainInfo.RankId);
                        this.userInfo.MovePosition(this.listPos[3]);
                    } else if(mainInfo.RankId == 1) {
                        this.currentPos = 1;
                        this.SetFakeRank(mainInfo.RankId);
                        this.userInfo.MovePosition(this.listPos[1]);
                    } else {
                        this.currentPos = 2;
                        this.userInfo.MovePosition(this.listPos[2]);
                    }
                } else {
                    this.currentPos = 2;
                    this.userInfo.MovePosition(this.listPos[2]);
                    if(this.lastRank == -1) {
                        this.otherInfo[0].SetFake(mainInfo.RankId-2,this.listTop, this.otherInfo[1].TotalScore, true, this.listRandomName);
                        this.otherInfo[1].SetFake(mainInfo.RankId-1,this.listTop, mainInfo.TotalScore, true, this.listRandomName);
                        this.otherInfo[2].SetFake(mainInfo.RankId-1,this.listTop, this.otherInfo[1].TotalScore, true, this.listRandomName, true);
                        this.otherInfo[3].SetFake(mainInfo.RankId+1,this.listTop, mainInfo.TotalScore, false, this.listRandomName);
                        this.otherInfo[4].SetFake(mainInfo.RankId+2,this.listTop, this.otherInfo[3].TotalScore, false, this.listRandomName);
                    } else {
                        if(this.lastRank == mainInfo.RankId) {
                            this.otherInfo[1].SetPointUpFake(mainInfo.TotalScore, true);
                            this.otherInfo[2].SetPointUpFake(mainInfo.TotalScore, false);
                            this.otherInfo[3].SetPointUpFake(mainInfo.TotalScore, false);
                            this.otherInfo[1].SetRankFake(mainInfo.RankId-1);
                            this.otherInfo[2].SetRankFake(mainInfo.RankId-1);
                            this.otherInfo[3].SetRankFake(mainInfo.RankId+1);
                        }
                    }
                }
                
                if(this.lastRank != -1) {
                    this.Run(this.lastRank, mainInfo.RankId);
                }
                this.lastRank = mainInfo.RankId;
            } else {
                this.userInfo.SetInfo(null, true);
                this.currentPos = 3;
                this.userInfo.MovePosition(this.listPos[3]);
                for(let i = 1; i < 5; i++) {
                    if(i-1 < listUser.length) {
                        this.otherInfo[i].SetInfo(listUser[i-1], false);
                    } else {
                        this.otherInfo[i].SetInfo(null, false);
                    }
                }
            }
        }
        this.CheckName(listUser);
        this.c_listUser = null;
    },

    CheckName(listUser) {
        for(let i = 0; i < this.otherInfo.length; i++) {
            if(this.otherInfo[i].RankId <= listUser.length) {
                for(let j = 0; j < listUser.length; j++) {
                    if(this.otherInfo[i].RankId == listUser[j].RankId) {
                        this.otherInfo[i].SetInfo(listUser[j], false);
                        break;
                    }
                }
            }
        }
    },

    SetFakeRank(rank) {
        if(this.currentPos == 1) {
            this.otherInfo[0].SetRankFake(rank-1);
            this.otherInfo[2].SetRankFake(rank+1);
            this.otherInfo[3].SetRankFake(rank+2);
            this.otherInfo[4].SetRankFake(rank+3);
        } else if(this.currentPos == 3) {
            this.otherInfo[0].SetRankFake(rank-2);
            this.otherInfo[2].SetRankFake(rank-1);
            this.otherInfo[3].SetRankFake(rank+1);
            this.otherInfo[4].SetRankFake(rank+2);
        }
    },

    Run(startRank, endRank) {
        if(startRank <= 3)
            startRank = 1;
        else startRank -= 1;
        if(endRank <= 3)
            endRank = 1;
        else endRank -= 1;
        if(startRank == endRank) {
            return;
        }
            
        this.speed = SIZE * 2 * (endRank - startRank);
        this.timeMove = 0.5;
    },

    TimeConvert(numb) {
		let minute = parseInt(numb / 60);
		let second = parseInt(numb - minute * 60);
		let strMinute = minute.toString();
		if(minute < 10) strMinute = "0"+minute;
		let strSecond = second.toString();
		if(second < 10) strSecond = "0"+second;
		this.lbTime.string = strMinute+":"+strSecond;
	},

    ClickMoveIn() {
        let xEnd = 0;
        if(this.posX < 0) {
            xEnd = this.posX - this.xMove;
        } else {
            xEnd = this.posX + this.xMove;
        }
        let acMove = cc.callFunc(() => {
            this.content.runAction(cc.moveTo(0.5, cc.v2(xEnd,this.content.y)));
        });
        let acEnd = cc.callFunc(()=>{ 
            this.btnIn.active = false;
            this.btnOut.active = true;
        });
        this.content.runAction(cc.sequence(acMove, cc.delayTime(0.5), acEnd));
    },

    ClickMoveOut() {
        let acMove = cc.callFunc(() => {
            this.content.runAction(cc.moveTo(0.5, cc.v2(this.posX,this.content.y)));
        });
        let acEnd = cc.callFunc(()=>{ 
            this.btnIn.active = true;
            this.btnOut.active = false;
        });
        this.content.runAction(cc.sequence(acMove, cc.delayTime(0.5), acEnd));
    },

    update(dt) {
        if(this.countTime > 0) {
            this.countTime -= dt;
            if(this.countTime <= 0) {
                this.countTime = 0;
                this.content.active = false;
                this.isGetTopWin = false;
                this.RequestGetTopWin();
                
            }
            this.TimeConvert(this.countTime);
        }
        if(this.timeMove > 0) {
            this.timeMove -= dt;
            for(let i = 0; i < this.otherInfo.length; i++) {
                this.otherInfo[i].Move(dt*this.speed);
            }
            if(this.speed > 0) {
                if(this.otherInfo[4].node.y > this.listPos[4].y+SIZE/2) {
                    this.PushToBottom();
                }
            } else {
                if(this.otherInfo[0].node.y < this.listPos[0].y - SIZE/2) {
                    this.PushOnTop();
                }
            }
            if(this.timeMove <= 0) {
                for(let i = 0; i < this.otherInfo.length; i++) {
                    this.otherInfo[i].node.y = this.listPos[i].y;
                }
                this.UpdatePoint();
            }
        }
    },

    UpdatePoint() {
        this.otherInfo[1].SetFake(this.otherInfo[1].RankId,this.listTop, this.mainScore, true, this.listRandomName);
        this.otherInfo[0].SetFake(this.otherInfo[0].RankId,this.listTop, this.otherInfo[1].TotalScore, true, this.listRandomName);
        this.otherInfo[2].SetFake(this.otherInfo[2].RankId,this.listTop, this.otherInfo[1].TotalScore, true, this.listRandomName,true);
        this.otherInfo[3].SetFake(this.otherInfo[3].RankId,this.listTop, this.mainScore, false,this.listRandomName);
        this.otherInfo[4].SetFake(this.otherInfo[4].RankId,this.listTop, this.otherInfo[3].TotalScore, false,this.listRandomName);
    },

    RequestGetTopWin() {
        if(!this.isGetTopWin) {
            this.scheduleOnce(()=>{
                let data = {};
                if(this.isSlot) {
                    data[1] = this.slotView.slotType;
                    require("SendRequest").getIns().MST_Client_Event_Tournament_Get_Top_Winner(data);
                } else {
                    require("SendRequest").getIns().MST_Client_Get_Fish_Tournament_Get_Account_Reward();
                }
                // this.RequestGetTopWin();
            } , 1); 
        }
        
    },

    ShowTopWin(data) {
        if(!this.isGetTopWin) {
            this.isGetTopWin = true;
            Global.UIManager.showTournamentPopup(data);
        }
        
    },  

    SetOther(rank, item, isUp) {
        if(rank < 0)
            item.SetInfo(null, false);
        if(rank > this.listTop.length)
            item.SetInfo(null, false);
    },

    PushOnTop() {
        this.otherInfo[this.otherInfo.length-1].node.y = this.otherInfo[0].node.y + SIZE;
        let newList = [];
        newList[0] = this.otherInfo[this.otherInfo.length-1];
        for(let i = 0; i < this.otherInfo.length-1; i++) {
            newList[newList.length] = this.otherInfo[i];
        }
        this.otherInfo = newList;
        this.otherInfo[0].SetFake(this.otherInfo[1].RankId-1,this.listTop, this.otherInfo[1].TotalScore, true, this.listRandomName);
    },

    PushToBottom() {
        this.otherInfo[0].node.y = this.otherInfo[this.otherInfo.length-1].node.y - SIZE;
        let newList = [];
        newList[this.otherInfo.length-1] = this.otherInfo[0];
        for(let i = 1; i < this.otherInfo.length; i++) {
            newList[i-1] = this.otherInfo[i];
        }
        this.otherInfo = newList;
        this.otherInfo[this.otherInfo.length-1].SetFake(this.otherInfo[this.otherInfo.length-2].RankId+1,this.listTop, this.otherInfo[this.otherInfo.length-2].TotalScore, false, this.listRandomName);
    },

    onLoad () {
        if(this.isCalPos) {
            let wScene = cc.winSize.width/2;
            if(this.isRight) {
                this.content.x = wScene - 75;
            } else {
                this.content.x = -wScene + 75;
            }
        }
        for(let i = 0; i < this.otherInfo.length; i++) {
            this.listPos[i] = this.otherInfo[i].node.getPosition();
        }
        this.posX = this.content.x;
        this.CreateRandomName();
        cc.game.on(cc.game.EVENT_HIDE, this.onEventHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onEventShow, this);
    },

    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onEventHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onEventShow, this);
    },

	onEventHide() {
        // this.timer = setInterval(()=>{
        //     this.update(0.1);
        // }, 100);
    },

    onEventShow() {
        clearInterval(this.timer);
        require("SyncTimeControl").getIns().SendPing();
    },

    CreateRandomName() {
        this.listRandomName = ["Player123","Player123","Player123","UserPllayer","Player123","Player123", "motcaitendai",
        "Player123","Player123","Player123","Player123", "caubehaha","Player123","Player123"];
    },
});
