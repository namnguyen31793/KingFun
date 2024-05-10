cc.Class({
    extends: cc.Component,
    ctor(){
    },

    properties: {
        SpriteBg1 : cc.Sprite,
        SpriteBg2 : cc.Sprite,
        value : cc.Label,
        Sprite_Array: [cc.SpriteFrame],
        SpriteTitle : cc.Sprite,
        Sprite_Title: [cc.SpriteFrame],
    },

    show(value, freeType, callBack){
        this.SpriteBg1.spriteFrame = this.Sprite_Array[freeType-1]
        this.SpriteBg2.spriteFrame = this.Sprite_Array[freeType-1]
        this.SpriteTitle.spriteFrame = this.Sprite_Title[freeType-1]

        this.value.string = Global.Helper.formatMoney(value);
        this.scheduleOnce(()=>{
            callBack();
            this.Hide();
        }, 2.0)
    },

    Hide(){
        this.value.string = '';
        this.node.active = false;
    },
});
