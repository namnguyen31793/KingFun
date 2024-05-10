
cc.Class({
    extends: cc.Component,
    start() {
        Global.countAvaFake = 0;
        var data = {
        }
        this.listAvaFake = [];
        this.listCacheAva = {};
        //set language
        Global.language = "vi";
    },

    TimeConvertFull(numb) {
        let hour = parseInt(numb/3600);
		let minute = parseInt((numb - hour*3600) / 60);
		let second = parseInt(numb - minute * 60 - hour*3600);
		return Global.Helper.FormatNumberInTime(hour)+":"+Global.Helper.FormatNumberInTime(minute)+":"+Global.Helper.FormatNumberInTime(second);
	},

    TimeConvert(numb) {
		let minute = parseInt(numb / 60);
		let second = parseInt(numb - minute * 60);
		return Global.Helper.FormatNumberInTime(minute)+":"+Global.Helper.FormatNumberInTime(second);
	},

    CheckFunction(fName, isShowCommand = true) {
        if (fName == Global.Enum.EFeatureStatus.Close) {
            if(isShowCommand)
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOCK_FUNTION"));
        } else if (fName == Global.Enum.EFeatureStatus.CommingSoon) {
            if(isShowCommand)
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("COMMING_SOON"));
        } else if (fName == Global.Enum.EFeatureStatus.None) {
            if(isShowCommand)
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOCK_FUNTION"));
            return false;
        } else if (fName == Global.Enum.EFeatureStatus.Open) {
            return true;
        }
        return false;
    },

    formatMail(content, display_len = 60) {
        let ret = "";
        for(let i = 0; i < content.length; i++) {
            if(i < display_len) {
                ret += content[i];
            }
        }
        if(content.length > display_len)
            ret += "...";
        return ret;
    },

    GetAvataOther(spr, name, event=null) {
        let numb = 1;
        if(name.includes("VipPlayer") || name.includes("_User")) {
            let str = "";
            for(let i = 9; i < name.length; i++) {
                str += name[i];
            }
            numb = parseInt(str);
        } else {
            if(name.length >= 4) {
                for(let i = 0; i < 4; i++) {
                    numb *= name.charCodeAt(name.length-1-i);
                }
            } else {
                for(let i = 0; i < name.length; i++) {
                    numb *= name.charCodeAt(name.length-1-i);
                }
            }
        }
        this.GetAvaFake(spr, numb, event);
        
        // let id = name.charCodeAt(name.length-1);
        // let idAvata = parseInt(id % 10) + 1;
        // cc.resources.load("Img/"+idAvata , cc.SpriteFrame , (err , pre)=>{ 
        //     spr.spriteFrame = pre;
        // });
    },

    GetAvataOtherById(spr, id, event = null) {

        this.GetAvaFake(spr, id, event);

        // let idAvata = parseInt(id % 10) + 1;
        // cc.resources.load("Img/"+idAvata , cc.SpriteFrame , (err , pre)=>{ 
        //     if(spr != null && pre != null)
        //         spr.spriteFrame = pre;
        // });
    },

    GetLoadingGameSlot(gameid, spr) {
        if(gameid == 0)
            spr.node.active = false;
        else {
            spr.node.active = true;
            Global.DownloadManager.LoadAssest("Slot",cc.SpriteFrame,"BGGame/"+gameid, (pre)=>{
                if(spr != null&& spr.materials != null)
                    spr.spriteFrame = pre;
                else {
                    console.log("-------------------eror-----------------");
                }
            });
        }
    },

    GetAvaFake(spr, numb, event = null) {
        let check = parseInt(numb%500);
       
        let idAvata = parseInt(check%Global.countAvaFake) + 1;
        
        idAvata = parseInt(check % 10) + 1;
        cc.resources.load("SpinHub-Fish/Art/Img/"+idAvata , cc.SpriteFrame , (err , pre)=>{ 
            if(spr != null && pre != null && spr.materials != null)
                spr.spriteFrame = pre;
                else {
                    console.log("-------------------eror-----------------");
                }
            if(event != null) event();
        });
    },

    GetAvata(spr) {
        // if(Global.MainPlayerInfo.spriteAva == null) {
            let id = cc.LoginController.getInstance().getNickname().charCodeAt(cc.LoginController.getInstance().getNickname().length-1);
            let idAvata = parseInt(id % 10) + 1;
            cc.resources.load("SpinHub-Fish/Art/Img/"+idAvata , cc.SpriteFrame , (err , pre)=>{ 
                spr.spriteFrame = pre;
            });
        // } else {
        //     spr.spriteFrame = Global.MainPlayerInfo.spriteAva;
        // }
    },

    HideString(inputString) {
        if (inputString.length <= 5) {
            // Nếu độ dài chuỗi ban đầu nhỏ hơn hoặc bằng 3, không cần mã hóa.
            return inputString;
        } else {
            // Lấy 3 ký tự cuối cùng của chuỗi ban đầu và thêm dấu * phía trước.
            const lastThreeChars = inputString.slice(-5);
            const encodedString = '***' + lastThreeChars;
            return encodedString;
        }
    },

    GetNationRandom(spr, numb) {
        let nation = numb%8;
        cc.resources.load("SpinHub-Fish/Art/Image/Flag/"+nation , cc.SpriteFrame , (err , pre)=>{ 
        // Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Flag/"+nation, (pre)=>{
            if(spr != null&& spr.materials != null)
                spr.spriteFrame = pre;
            else {
                console.log("-------------------eror-----------------");
            }
        });
    },

    GetNameNation(numb) {
        let nation = numb%8;
        switch(nation) {
            case 0 :
                return "Vn";
            case 1 :
                return "Tl";
            case 2 :
                return "Jp";
            case 3 :
                return "Ca";
            case 4 :
                return "Kr";
            case 5 :
                return "In";
            case 6 :
                return "La";
            case 7 :
                return "Us";

        }
    },

    NumberShortK(number) {
        return number <= 0 ? "0" : number < 10000 ? this.formatNumber(number) : this.formatNumber((number / 1000)) + "K";
    },

    formatPrice(value) {
        if (value < 1000)
            return value.toString();
        else if (value < 1000000)
            return parseInt(value / 1000) + "K";
        else
            return parseInt(value / 1000000) + "M";
    },

    FormatNumberInTime(numb) {
        if(numb < 10)
            return "0"+numb;
        return numb.toString();
    },

    UpdateListWidget(listWidget) {
        for(let i = 0; i < listWidget.length; i++) {
            if(listWidget[i].isAlignRight) {
                listWidget[i].right += (1575-cc.winSize.width)/2;
            }
            if(listWidget[i].isAlignLeft) {
                listWidget[i].left += (1575-cc.winSize.width)/2;
            }
            listWidget[i].updateAlignment();
        }
    },

    coppyToClipboard(text) {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
          }
          navigator.clipboard.writeText(text).then(function() {
            Global.UIManager.showAlertMini("Đã Sao Chép");
            console.log("web");
          }, function(err) {
              Global.UIManager.showAlertMini("Không Thể Sao Chép");
          });
    },

    fallbackCopyTextToClipboard(text) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if(CONFIG.MERCHANT == 3) {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "Coppy";
                let methodSignature = "(Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature, text);
                Global.UIManager.showAlertMini("Đã Sao Chép");
                return;
            }
            if(CONFIG.VERSION == "1.0.1" || CONFIG.VERSION == "1.0.2") {
                if(Global.ShopPopup != null && Global.ShopPopup.node != null && Global.ShopPopup.node.active) {
                    Global.ShopPopup.editbox.string = text;
                    Global.ShopPopup.editbox.focus();
                }
            } else {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "Coppy";
                let methodSignature = "(Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature, text);
                Global.UIManager.showAlertMini("Đã Sao Chép");
            }
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController",
                "copyClipboard:", text);
            Global.UIManager.showAlertMini("Đã Sao Chép");
        }
        
	},

    GetPositionSliceBySittingId(sittingId, position) {
        let direction = this.GetVectorDirectionBySittingID(sittingId);
        return cc.v2(position.x * direction.x, position.y * direction.y);
    },

    GetPositionSliceBySittingIdAndMainSitting(checkSittingId, mainSittingId, position) {
        let checkDirection = this.GetVectorDirectionBySittingID(checkSittingId);
        let mainDirection = this.GetVectorDirectionBySittingID(mainSittingId);
        return cc.v2(position.x * checkDirection.x * mainDirection.x, position.y * checkDirection.y * mainDirection.y);
    },

    GetVectorDirectionBySittingID(sittingId) {
        switch (sittingId) {
            case 2:
                return cc.v2(1, 1);
            case 3:
                return cc.v2(-1, 1);
            case 5:
                return cc.v2(-1, -1);
            case 7:
                return cc.v2(1, -1);
            default:
                return cc.v2(1, 1);
        }
    },

    GetVipIcon(vipLevel, spr) {
        if(vipLevel == 0)
            spr.node.active = false;
        else {
            spr.node.active = true;
            cc.resources.load("Img/Vip"+vipLevel , cc.SpriteFrame , (err , pre)=>{ 
                spr.spriteFrame = pre;
            });
        }
    },

    GetIconItemByTypeGacha(spr, type, num) {
        let nameImg = "Item"+type;
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"ItemGaccha/"+nameImg, (pre)=>{
            if(spr != null&& spr.materials != null)
                spr.spriteFrame = pre;
            else {
                console.log("-------------------eror-----------------");
            }
        });
    },

    GetFishIconLobby(idFish, spr) {
        if(idFish == 0)
            spr.node.active = false;
        else {
            spr.node.active = true;
            cc.resources.load("IconFish/"+idFish, cc.SpriteFrame , (err , pre)=>{ 
                spr.spriteFrame = pre;
            });
        }
    },

    GetFishIcon(idFish, spr) {
        if(Global.FishIconAtlas == null){
          
            cc.resources.load("SpinHub-Fish/Art/Fish/FishIconAtlas",cc.SpriteAtlas, (err, pre)=>{
                Global.FishIconAtlas = pre;
                spr.spriteFrame = pre.getSpriteFrame(idFish.toString());
            });
        }else{
            spr.spriteFrame = Global.FishIconAtlas.getSpriteFrame(idFish.toString());
        }
    },

    GetFishBigIcon(idFish, spr) {
        if(Global.FishIconAtlas == null){

            try
            {
            
            cc.resources.load("SpinHub-Fish/Art/Fish/FishIconAtlas",cc.SpriteAtlas, (err,pre)=>{
                Global.FishIconAtlas = pre;
                spr.spriteFrame = pre.getSpriteFrame(idFish);
            });
            }
            catch(e)
            {
                cc.log(">> GetFishBigIcon: "+e.toString());
            }
        }else{
            spr.spriteFrame = Global.FishIconAtlas.getSpriteFrame(idFish);
        }
    },

    GetIconGame(spr, gameid) {
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"IconGame/Icon"+gameid, (pre)=>{
            if(spr != null&& spr.materials != null)
                spr.spriteFrame = pre;
            else {
                console.log("-------------------eror-----------------");
            }
        });
    },

    GetIconBagByType(spr, type) {
        let nameImg = "Item"+type;
        if(type != Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER && type != Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER) {
            Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Item/"+nameImg, (pre)=>{
                if(spr != null&& spr.materials != null)
                    spr.spriteFrame = pre;
                else {
                    console.log("-------------------eror-----------------");
                }
            });
        } else {
            Global.DownloadManager.LoadAssest("GachaEvent",cc.SpriteFrame, nameImg, (pre)=>{
                if(spr != null&& spr.materials != null)
                    spr.spriteFrame = pre;
                else {
                    console.log("-------------------eror-----------------");
                }
            });
        }
        
    },

    formatNumber(number, width = 3) {
        if(number<0) number=0;
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },

    formatNumber2(number, width = 3) {
        if(number<0) number=0;
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },

    formatNumberLong(number) {
        if(number<0) number=0;
        if(number < 1000000) 
            return this.formatNumber(number);
        else if(number < 1000000000) {
            let n = number/1000;
            // var result = Math.round(n*100)/100;
            var result = parseInt(n);
            return this.formatNumber(result) + "K";
        } else {
            let n = number/1000000;
            // var result = Math.round(n*100)/100;
            var result = parseInt(n);
            return this.formatNumber(result)+"M";
        }
    },

    formatMoney(money) {
        if(money<0) money=0;
        // char k[] = { 'K', '\0'};
        // char m[] = { 'M', '\0'};
        // char b[] = { 'B', '\0'};
        // char u[] = { '\0'};
        let format = "";
        let mo = Math.abs(money);
        //int cha;
        if (mo >= 1000000000) {
            mo /= 1000000000;
            format = "B";
        } else if (mo >= 1000000) {
            mo /= 1000000;
            format = "M";
        } else {
            return this.formatNumber(money);
        }

        let str = money.toString() + "0";
        let str1 = mo.toString() + "a";

        let idex = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] !== str1[i]) {
                idex = i;
                break;
            }

        }

        return (money < 0 ? "-" : "") + Math.floor(mo) + "," + str.toString()[idex] + str.toString()[idex + 1] + format;
    },

    formatName(name, width = 6) {
        let str = "";
        for(let i = 0; i < name.length; i++) {
            if(i < width) {
                str += name[i];
            }
        }
        if(name.length > width)
            str += "...";
        return str;
    },

    formatString(text, argument) {
        for (var i = 0; i < argument.length; i++) {
            text = text.replace("{" + i + "}", argument[i]);
        }
        return text;
    },

    GetGameSlot() {
        let list = [];
        for(let i = 19; i < 30; i++) {
            if(i != 23 && i != 27) {
                list.push(i);
            }
        }
        // if (!cc.sys.isNative) {
        //     for(let i = 19; i < 27; i++) {
        //         if(i != 23) {
        //             list.push(i);
        //         }
        //     }
        // } else {
        //     for(let i = 0; i < Global.listBundle.length; i++) {
        //         if(this.ComporeGame(Global.listBundle[i].toString())) {
        //             list.push(Global.listBundle[i].toString());
        //         }
        //     }
        // }
        return list;
    },

    RandomHint(txt) {
        if(Global.language == "vi") {
            txt.string = Global.hintVN[Global.RandomNumber(0,Global.hintVN.length)];
        } else {
            txt.string = Global.hintENG[Global.RandomNumber(0,Global.hintVN.length)];
        }
    },

    ComporeGame(name1) {
        for(let i = 19; i < 27; i++) {
            if(i != 23) {
               if(name1 == i.toString()) {
                    return i.toString();
               }
            }
        }
        return false;
    },

    GetRealTimeStartUp() {
        let currentDateTime = new Date();
        let realtimeSinceStartup = (currentDateTime.getTime() - Global.startAppTime.getTime())/1000;
        return realtimeSinceStartup;
    },

    LogAction(action) {
        // action = action + " - "+cc.BalanceController.getInstance().getBalance();
        // var data = {
        //     AccountId : cc.LoginController.getInstance().getUserId(),
        //     Content : action,
        //     Country : Global.language
        // }
        // if (!cc.sys.isNative) {

        // } else {
        //     Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-tracking/TrackingActionUser", data, (response)=>{
        //         console.log(response);
        //     });
        // }
    },

    LogUseFreeSpin(typeUse, gameType) {
        var data = {
            AccountId : cc.LoginController.getInstance().getUserId(),
            Type_Use : typeUse,
            GameType : gameType
        }
        if (!cc.sys.isNative) {

        } else {
            Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-tracking/TrackingUseFree", data, (response)=>{
                console.log(response);
            });
        }
    },

    CheckShowRate() {
        if(Global.Helper.CompareVersion(CONFIG.VERSION, "1.0.5") && !Global.showRatePopup) {
            let keySave = cc.sys.localStorage.getItem("RATE_GAME") || false;
            if(!keySave) {
                if(Global.Helper.GetRealTimeStartUp() > 1200) {
                    Global.showRatePopup = true;
                    Global.Helper.LogAction("show popup rate");
                    Global.UIManager.showPopupLily(Global.MyLocalization.GetText("RATE_GAME"),()=>{
                        cc.sys.localStorage.setItem("RATE_GAME", true);
                        if (cc.sys.os == cc.sys.OS_ANDROID) {
                            Global.Helper.LogAction("click rate");
                            let className = "org/cocos2dx/javascript/AppActivity";
                            let methodName = "ShowRatePopup";
                            let methodSignature = "()V";
                            jsb.reflection.callStaticMethod(className, methodName, methodSignature);
                        }
                    }, ()=>{
                        Global.Helper.LogAction("click deny rate");
                    }, true);
                    return true;
                }
            }
        }
        return false;
    },

    GetStringFullYear(date){
        let timeReturn = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return timeReturn;
    },

    CompareVersion(version1, version2) {
        let list1 = version1.split(".");
        let list2 = version2.split(".");
        if(list1[0] > list2[0]) {
            return true;
        } else if(list1[1] > list2[1]) {
            return true;
        } else if(list1[2] > list2[2]) {
            return true;
        }
        return false;
    },

    GetConfigRandom(listChoise, listPercent, total = 100) {
        let r =  Global.RandomNumber(0, total);
        let count = 0;
        for(let i = 0; i < listPercent.length; i++) {
            count += listPercent[i];
            if(count < r) {
                return listChoise[i];
            }
        }
        return listChoise[0];
    },

    onFacebookLoginSuccess (authInfo) {
        Global.LoginView.LoginWithFacebookData3(authInfo);
	},
	

	onFacebookLoginCancel () {
        // Global.UIManager.hideMiniLoading();
		console.log("onFacebookLoginCancel");
	},
	

	onFacebookLoginError (error) {
        // Global.UIManager.hideMiniLoading();
		console.log("onFacebookLoginError error = " + error);
        Global.UIManager.showCommandPopup("Lỗi đăng nhập Facebook: "+error);
	},
    isStringNullOrEmpty(str) {
        return typeof str === "null" || str === "";
    },

    onLoad() {
        Global.Helper = this;
    },

    onDestroy(){
		Global.Helper = null;
	},
});
