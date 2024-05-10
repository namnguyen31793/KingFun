var BulletCollection = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new BulletCollection();
            return this.self;
        }
    },

    properties : {
        listBullet : [],
    },

    

});
module.exports = BulletCollection;