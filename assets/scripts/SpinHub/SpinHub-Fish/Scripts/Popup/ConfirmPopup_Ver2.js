

cc.Class({
    extends: cc.Component,

    properties: {
      content:cc.Label,     
    },

    onClickButtonYes(){
      this.Hide();
    
      if(this.yesEvent != null)
        this.yesEvent();
      this.ClearEvent();
	  },

    onClickButtonNo(){
      this.Hide();
      if(this.noEvent != null)
        this.noEvent();
      this.ClearEvent();
    },

    ClearEvent() {
      this.noEvent = null;
      this.yesEvent = null;
    },
    
    Hide() {     
       this.node.active = false;
       Global.UIManager.hideMark();    
    },

    show(message, yesEvent, noEvent){
      this.node.setSiblingIndex(this.node.parent.children.length-1);
      this.node.active = true;
 
      this.content.string = message;
      this.yesEvent = yesEvent;
      this.noEvent = noEvent;
    
	  },

   

    update(dt) {
     
    },

    onDestroy(){
      Global.ConfirmPopup = null;
    },
});
