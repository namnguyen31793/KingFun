// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        iceArray: {
            default: [],
            type: [cc.Node],
        },
        freezeDuration: {
            default: 2, // Duration of the ice freeze effect in seconds
            type: cc.Float,
        },
        FreezeSound : cc.AudioClip,      
    },

   

    onEnable()
    {
      
        this.showRandomIce();
    },

    showRandomIce() {
        const screenSize = cc.winSize;
        const iceCount = this.iceArray.length;
        
        if (iceCount > 0) {
            for (let i = 0; i < iceCount; i++) {
                const iceNode = this.iceArray[i];
                iceNode.setPosition(this.getRandomPosition(screenSize));
                iceNode.angle = this.getRandomRotation();
                iceNode.active = true;
                this.playIceAnimation(iceNode);
            }
        }

        this.scheduleOnce(this.cleanup, this.freezeDuration);
    },

    getRandomPosition(screenSize) {
        const randomX = (Math.random() - 0.5) * 2 * screenSize.width * 0.5;
        const randomY = (Math.random() - 0.5) * 2 * screenSize.height * 0.5;
        return cc.v2(randomX, randomY);
    },

    getRandomRotation() {
        return (Math.random() - 0.5) * 2  * 360;
    },

    playIceAnimation(iceNode) {
        const animationComponent = iceNode.getComponent(cc.Animation);
        if (animationComponent && animationComponent.defaultClip) {            
            animationComponent.play();
            cc.audioEngine.playEffect(this.FreezeSound, false);
        }
    },

    cleanup() {
        // Add cleanup logic here (e.g., removing the ice effect from the screen)
        for (let i = 0; i < this.iceArray.length; i++) {
            const iceNode = this.iceArray[i];
            iceNode.active = false;
            // Additional cleanup tasks specific to your project
        }
    },
});
