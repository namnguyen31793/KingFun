// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Coin_Multi_Fly : cc.Animation,

        VFX_Coin_Fall : cc.Node,
        VFX_Coin_Particle_Array : [cc.ParticleSystem],

        Particle_Coin_Mutli_Content : cc.Node,
        Particle_Coin_Mutli_Particle_Array : [cc.ParticleSystem],

        Multi_Sprite : cc.Sprite,
        Multi_Sprite_Frame : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable()
    {
        this.Coin_Multi_Fly.node.active = false;
        this.VFX_Coin_Fall.active = false;
        this.Particle_Coin_Mutli_Content.active = false;
        
    },

    start () {

    },

    ShowParticle_CoinFall()
    {
        this.node.stopAllActions();
        this.VFX_Coin_Fall.active = true;
        for(let i=0;i< this.VFX_Coin_Particle_Array.length;i++)
        {
            this.VFX_Coin_Particle_Array[i].resetSystem();
        }
    },
    
    OffParticle_CoinFall()
    {
        this.node.stopAllActions();
        this.VFX_Coin_Fall.active = false;
        for(let i=0;i< this.VFX_Coin_Particle_Array.length;i++)
        {
            this.VFX_Coin_Particle_Array[i].stopSystem();
        }
    },

    ShowParticle_Coin_Mutli()
    {
        this.node.stopAllActions();
        this.Particle_Coin_Mutli_Content.active = true;
        for(let i=0;i< this.Particle_Coin_Mutli_Particle_Array.length;i++)
        {
            this.Particle_Coin_Mutli_Particle_Array[i].resetSystem();
        }
    },

   OffParticle_Coin_Mutli()
    {
        this.node.stopAllActions();
        this.Particle_Coin_Mutli_Content.active = false;
        for(let i=0;i< this.Particle_Coin_Mutli_Particle_Array.length;i++)
        {
            this.Particle_Coin_Mutli_Particle_Array[i].stopSystem();
        }
    },

    ShowAnimation_Coin_Multi_Fly(multiValue,callbackFunc = null)
    {   
        this.Coin_Multi_Fly.node.active = true;
        this.Multi_Sprite.spriteFrame = this.Multi_Sprite_Frame[multiValue-2];
        require("AudioController_V2").getIns().audioPool.play_EndMultiCoin_Fx_Sound();
        let callBack = ()=>{        
            this.Coin_Multi_Fly.off("finished" , callBack);            
            if(callbackFunc != null)
                callbackFunc();
            this.Coin_Multi_Fly.node.active = false;
          
           }
           this.Coin_Multi_Fly.on("finished" ,callBack );
           this.Coin_Multi_Fly.play("CH_CoinMulti_Content");
    }

    // update (dt) {},
});
