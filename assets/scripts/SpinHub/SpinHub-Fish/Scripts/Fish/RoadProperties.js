
var PathProperties = require ("PathProperties");
var RoadProperties =  cc.Class({
    extends: cc.Component,

    properties: {
         targetPointList:[], // list cac diem de tao thanh 1 duong di
		listRadius:[],
		listDuration:[],

		numberOfPoint : 30,
		pathPropertiesList :[require ("PathProperties")],
		totalDuration:0.0,
		targetObject:null,

    },
   

    Setup( targetObject, pathId,  duration, radius, vectorDireciton, fishType, numberOfGroup)
    {
        this.targetObject = targetObject;
        this.totalDuration = 0.0;
        this.CreateMemberInfo(pathId, duration, radius, fishType, numberOfGroup);
        this.SetupRoad(vectorDireciton);

    },

   SetupRoad( vectorDireciton)
    {
        for(let i = 0;i< this.targetPointList.length - 1;i++)
        {
            // duyet xem day co phai la road dau tien hay khong 
            let isNextRoad = i > 0;

            // lay gia tri cua diem bat dau 
            let Point2 = cc.v2(0,0);
            if (isNextRoad)Point2 = this.pathPropertiesList[i - 1].GetStartOldPath();
                
            let pathProperties = new PathProperties();
            pathProperties.Create(this.targetObject);
            pathProperties.Init(this.XoayToaDo(vectorDireciton,this.targetPointList[i].clone()), this.XoayToaDo(vectorDireciton,this.targetPointList[i + 1].clone()), this.listRadius[i], this.numberOfPoint, this.listDuration[i], isNextRoad, Point2, vectorDireciton);
            this.pathPropertiesList.push(pathProperties);
            this.totalDuration += this.listDuration[i];
        }

    },

    XoayToaDo(huong, point) {
        return cc.v2(huong.x * point.x, huong.y*point.y);
    },

    UpdatePosByTime( time,  baseSpeed,isRotate = true)
    {
       let  indexPath = 0;
        let i = 0	;
        for (i = 0; i < this.listDuration.length; i++) {

            if (time - this.listDuration [i] >= 0) {

                time -= this.listDuration [i];
            } else {
                indexPath = i;
                break;
            }
        }
        

        let returnObj = {};
        let newPosValue = this.pathPropertiesList [indexPath].GetPosByTime (time,isRotate);
        returnObj.newPosition = newPosValue.newPosX;
        returnObj.speedAniFish = this.pathPropertiesList[indexPath].GetSpeedAnimationPath(baseSpeed);
        returnObj.hadRotate = newPosValue.hadRotate;
        return returnObj;
    },


    CreateMemberInfo( pathId, duration, radius, fishType, numberOfGroup){
        this.targetPointList = [];
        this.listRadius = [];
        this.listDuration = [];

        let pathElement = require ("PathStore").getIns().getPathById(pathId.toString());
        for (let i = 0; i < pathElement.x.length - 1; i++)
        {
            if (pathElement.x [i] == pathElement.x [i + 1])
                pathElement.x [i + 1] -= 1;
            if (pathElement.y [i] == pathElement.y [i + 1])
                pathElement.y [i + 1] -= 1;
        }
        if(numberOfGroup != -1) {
            let pX = 0;
            let pY = 0;
            if(fishType <= 4) {
                if(numberOfGroup == 1) {
                    pX = -25;
                    pY = -30;
                } else if(numberOfGroup == 2) {
                    pX = 30;
                    pY = -22;
                } else if(numberOfGroup == 3) {
                    pX = -35;
                    pY = 24;
                } else if(numberOfGroup == 4) {
                    pX = 45;
                    pY = 35;
                } else if(numberOfGroup == 5) {
                    pX = 0;
                    pY = -33;
                } else {
                    pX = Global.RandomNumber(-100,100);
                    pY = Global.RandomNumber(-100,100);
                }
            } else if(fishType <= 8) {
                if(numberOfGroup == 1) {
                    pX = -65;
                    pY = -60;
                } else if(numberOfGroup == 2) {
                    pX = 60;
                    pY = -52;
                } else if(numberOfGroup == 3) {
                    pX = -65;
                    pY = 54;
                } else if(numberOfGroup == 4) {
                    pX = 75;
                    pY = 65;
                } else if(numberOfGroup == 5) {
                    pX = 0;
                    pY = -63;
                } else {
                    pX = Global.RandomNumber(-100,100);
                    pY = Global.RandomNumber(-100,100);
                }
            }
            
            for (let i = 0; i < pathElement.x.length; i++)
            {
                pathElement.x [i] += pX;
                pathElement.y [i] += pY;
            }
        }
        for (let i = 0; i < pathElement.x.length; i++)
        {
            this.targetPointList.push(cc.v2(pathElement.x[i], pathElement.y[i]));
        }
        for (let i = 0; i < pathElement.radius.length; i++)
        {
            this.listRadius.push(pathElement.radius[i] + 50 * radius);
        }
        for (let i = 0; i < pathElement.duration.length; i++)
        {
            this.listDuration.push(pathElement.duration[i] / 10.0 * duration);
        }
       
    },

});
module.exports = RoadProperties;
