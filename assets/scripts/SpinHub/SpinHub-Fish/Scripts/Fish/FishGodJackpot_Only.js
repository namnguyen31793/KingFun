

cc.Class({
    extends: require("Fish2D"),
    ctor() {
       this.oldJackpotValue = 0;
       this.newJackpotValue = 0;
       this.timeElapsed = 0; // Biến đếm thời gian đã trôi qua
       this.updateInterval = 5; // Khoảng thời gian giữa các lần cập nhật (5 giây)
    },
    properties: {
        JackpotValue_Label :  require("TextJackpot"),
    },
    SetUpAnimation() {
        //  this.imgName.opacity = 255;
          this.node.opacity = 255;
         // this.ske.setAnimation(0, 'SWIM', true);
         cc.log("SetUpAnimation");
          this.SetHide();
      },

      
    SetHide() {
        
        cc.log("SET HIDE");
        cc.log("Global.agent: "+Global.agent);
            if(Global.agent == 0) {
               
                    this.node.opacity = 100;
                    if(this.imgNote != null)
                        this.imgNote.active = true
                    this.listColider = this.node.getComponents(cc.BoxCollider);   
                    if(this.listColider) {
                        for(let i = 0 ; i < this.listColider.length ; i++){
                            this.listColider[i].enabled = false;
                        }
                    }
            } else {
                this.ske.node.opacity = 255;
            }
      
    },
  

    
    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
  
            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/GodJackpotController', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish3","GodJackpotController", (prefab)=>{
                try
                {
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.luckyBoxWheelContainer;  
                node.setSiblingIndex(node.parent.children.length-1);
                node.setPosition(cc.v2(0,0));    
                node.active = true;
              
              
                node.getComponent("GodJackpotController").Init_GodJackpot_Reward(fishValue,killActor);
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
               
            });
      

    },


  
    update (dt) {
        this._super(dt);
        this.timeElapsed += dt;
        if (this.timeElapsed >= this.updateInterval) {
            this.timeElapsed = 0; // Đặt lại biến đếm thời gian
            if (this.oldJackpotValue != this.newJackpotValue) {
                this.oldJackpotValue = this.newJackpotValue;
                this.JackpotValue_Label.StartIncreaseTo(this.oldJackpotValue);
            }
        }
        this.newJackpotValue = Global.InGameView.grandJackpotValue;

        
    },

   

    onLoad() {
        this.listColider = this.getComponents(cc.BoxCollider);   
    },
   
    
});
