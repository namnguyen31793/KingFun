var PathStore = cc.Class({

    properties: {
        listFishConfig:null,
        pathConfig:null,
        SMove:2,
        SRedudancy:5,
    },

    statics:{
        getIns(){
            if(this._self == null){
                this._self = new PathStore();
            }
            return this._self;
        }
    },

    setInfoData(path){
        this.pathConfig  =  JSON.parse(path);
    },
    setInfoConfigFish(list){
        this.listFishConfig = list;
    },

    getPathById(pathId){
        return this.pathConfig.path[pathId];
    },
    getGroupById(groupId) {
        return this.pathConfig.group[groupId];
    },

    getConfigGroupById(configGroupId) {
        return this.pathConfig.configGroup[configGroupId];
    },

    getBigFishConfig(posId) {
        return this.pathConfig.bigFish[posId];
    },

    getJackpotConfig() {
        return this.pathConfig.jackpot["1"].path;
    },

    getSammuraiConfig() {
        return this.pathConfig.sammurai["1"].path;
    },

    getRoomFishSpecialConfig(roomId) {
        return this.pathConfig.roomFishSpecial[roomId];
    },

    getRoomFishNormalConfig(roomId=1) {
        return this.pathConfig.roomFishNormal[roomId];
    },

    getEventConfig(roomId=1) {
        return this.pathConfig.event[roomId];
    },

    getPathEvent(roomId=1) {
        return this.pathConfig.pathEvent[roomId];
    },

    getBossConfig(roomId=1)
    {
        return this.pathConfig.boss[roomId];
    },
    BaseSpeedAnimationFish(fishType)
    {
        let _Type = parseInt(fishType);
        switch (_Type)
        {
            case 1:
            case 2:
            case 3:
            case 4:
                return 100;
            case 7:
            case 8:        
            case 9:        
            case 10:        
            case 11:        
                return 150;
            case 5 :
            case 13:
            case 14:   
                return 150;
            case 6:
                return 200;

            case 12:
            case 15:
                return 120;
            case 16:
                return 60;
            case 17:
                return 50;
            case 100:
                return 150;
            case 118:
                    return 50;
            default:
                return 100;
        }
    },
    BaseSpeedAnimationFishTNL(fishType){
        let _Type = parseInt(fishType);
        switch (_Type)
            {
                case 1:
                    return  150;
                case 2:
                    return 200;
                case 3:
                    return  250;
                case 4:
                    return 200;
                case 5:
                    return 200;
                case 6:
                    return  600;
                case 7:
                    return  200;
                case 8:
                    return  150;
                case 9:
                    return  100;
                case 10:
                    return  175;
                case 11:
                    return 150;
                case 12:
                    return  120;
                case 13:
                    return  150;
                case 14:
                    return  150;
                case 15:
                    return  120;
                case 16:
                    return 60;
                case 17:
                    return 50;
                case 50:
                    return 60;
                case 100:
                    return 75;
                default:
                    return 100;
            }
    }

});
module.exports = PathStore;