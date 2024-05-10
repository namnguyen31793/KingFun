
cc.Class({
    extends: cc.Component,

    properties: {
        bg : [cc.Node]
    },

    
    start () {
        let ratio = cc.winSize.width/1334;
        this.node.scaleX = ratio;
        // this.node.width = cc.winSize.width;
        // if(this.bg.length == 1) {
        //     this.bg[0].width = cc.winSize.width;
        // } else {
            
        //     console.log("----------------"+cc.winSize.width+"    "+ratio);
        //     for(let i = 0; i < this.bg.length; i++) {
        //         this.bg[i].scaleX = ratio;
        //     }
        // }
    },
});
