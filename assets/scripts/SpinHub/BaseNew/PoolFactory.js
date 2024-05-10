const PoolPrefab = cc.Class({
    name: 'PoolPrefab',
    properties: {
        prefabName: {
            default: ''
        },
        objectPrefab: {
            type: cc.Prefab,
            default: null
        },
        initialCount: 5
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        poolPrefabList: {
            type: [PoolPrefab],
            default: []
        }
    },

    onLoad() {
        this.pools = [];
        for (let t = 0; t < this.poolPrefabList.length; t++) {
            const prefabName = this.poolPrefabList[t].prefabName;
            const nodePool = new cc.NodePool(prefabName);

            for (let n = 0; n < this.poolPrefabList[t].initialCount; n++) {
                const obj = cc.instantiate(this.poolPrefabList[t].objectPrefab);
                obj.name = prefabName;
                obj.active = false;
                nodePool.put(obj);
            }

            const poolData = {
                prefabName: prefabName,
                objectPrefab: this.poolPrefabList[t].objectPrefab,
                pool: nodePool
            };
            this.pools[t] = poolData;
        }
        this.node.poolFactory = this;
    },

    getObject(type) {
        let obj = null;
        for (let i = 0; i < this.pools.length; i++) {
            const poolData = this.pools[i];
            const prefabName = poolData.prefabName;
            const objectPrefab = poolData.objectPrefab;
            const pool = poolData.pool;

            if (prefabName === type) {
                obj = pool.size() > 0 ? pool.get() : cc.instantiate(objectPrefab);
                obj.name = prefabName;
                obj.active = true;
                break;
            }
        }
        return obj;
    },

    removeObject(obj) {
        const objName = obj.name;
        for (let i = 0; i < this.pools.length; i++) {
            const poolData = this.pools[i];
            const prefabName = poolData.prefabName;
            const pool = poolData.pool;

            if (objName === prefabName) {
                obj.active = false;
                pool.put(obj);
                break;
            }
        }
    },

    onDestroy() {
        for (let i = 0; i < this.pools.length; i++) {
            const pool = this.pools[i].pool;
            pool && pool.clear();
            this.poolPrefabList[i].objectPrefab = null;
        }
        this.pools = null;
        this.poolPrefabList = null;
        this.node.poolFactory = null;
    }
});