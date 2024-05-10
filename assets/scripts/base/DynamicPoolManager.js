// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.dictPools = {};
    },

    properties: {
       
    },

    addNewPool(prefabName,prefab)
    {
        var i = {
            prefabName: prefabName,
            prefab: prefab,
            pool: new cc.NodePool(prefabName)
        };
        this.dictPools[prefabName] = i
    },
    getObject(prefabName) {
        var e = null;
        if (this.dictPools[prefabName]) {
            var i = this.dictPools[prefabName]
              , n = i.prefab
              , o = i.pool;
            return o.size() > 0 ? (e = o.get(),
            cc.log("Hassss pool + has node")) : ((e = cc.instantiate(n)).name = prefabName,
            e.active = !1,
            cc.log("Hassss pool + no node")),
            e
        }
        return null
    },
    removeObject(t) {
        var e = t.name;
        if (this.dictPools[e]) {
            var i = this.dictPools[e]
              , n = i.prefabName
              , o = i.pool;
            e == n && (t.active = !1,
            o.put(t))
        }
    },
    onDestroy() {
        for (var t in this.dictPools)
            if (this.dictPools.hasOwnProperty(t)) {
                var e = this.dictPools[t];
                if (e) {
                    var i = e.pool;
                    i && i.clear(),
                    e.prefab = null
                }
            }
    }
});
