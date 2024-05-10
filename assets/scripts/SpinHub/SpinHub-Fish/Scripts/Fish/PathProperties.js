var PathProperties = cc.Class({
    extends: cc.Component,
    ctor(){
        this.pointList =[];
        this.distanceList = [];
        this.timeMoveList = [];
    },
    properties: {
        cachePoint:null,//  su dung de noi cac path voi nhau 
        totalTime :0.0,
        totalDictance : 0.0,
        controlPoint:[],
    },

    Create(OwnerObject) {
        this.OwnerObject = OwnerObject;
        this.pointList =[];
        this.distanceList = [];
        this.timeMoveList = [];
   },

   Init( startPoint, endPoint, radius, numberOfPoint, duration, isNextPath, lastEndPoint,  vectorDireciton)
    {
        // chia path thanh 4 phan nho de tao duong cong
        this.controlPoint.length = 4// new Vector2[4];
        this.controlPoint[0] = startPoint;
        // cc.log(tempPoint1)
        // cc.log(tempPoint2)
        // cc.log(tempPoint3)
        // tinh toan cho path dau tien
        if (!isNextPath)
            this.controlPoint[1] = this.GetPoint1ByRadis(startPoint.clone(), endPoint.clone(), radius);
        else
            this.controlPoint[1] = this.GetPoint1BySymmectricCenter(lastEndPoint, startPoint);
        this.controlPoint[3] = this.GetPoint2ByRadis(startPoint.clone(), endPoint.clone(), radius);
        // luu lai de xu dung cho path tiep theo
        this.cachePoint = this.controlPoint[3];
        this.controlPoint[2] = endPoint;
// cc.log(this.controlPoint);

      
        // tinh toan di chuyen theo vi tri cua nguoi choi
        // for(let i = 0;i< this.controlPoint.length;i++)
        // {
            // this.controlPoint[i].x *=  vectorDireciton.x;        //.mulSelf(vectorDireciton)

            // this.controlPoint[i].y *=  vectorDireciton.y;
        // }
        // chia nho de lay khoang cach
        let arr = [...this.controlPoint];
        this.distanceList = this.GetDistanceList( arr,numberOfPoint);
        this.totalDictance = this.GetSumDistance(this.distanceList);
        // tinh thoi gian di het khoang duong da chia 
        this.timeMoveList = this.GetTimeMoveList(this.distanceList, this.totalDictance, duration);
        //	GetPointListToString ();
        // cc.log(this.pointList);
    },

    GetDistanceList(controlPoint, numberOfPoint)
    {
        let returnDistanceList = [];
        let tempPoint0 = controlPoint[0];
        let tempPoint1 = cc.v2((controlPoint[1].x + controlPoint[0].x)*0.5 ,  (controlPoint[1].y + controlPoint[0].y)*0.5 );
        let tempPoint2 =cc.v2((controlPoint[2].x+ controlPoint[3].x)*0.5 , (controlPoint[2].y+ controlPoint[3].y)*0.5);
        let tempPoint3 = controlPoint[2];
        // let c = [];
        // c[0] = tempPoint0;
        // c[1] = tempPoint1;
        // c[2] = tempPoint2;
        // c[3] = tempPoint3;
        // cc.log(c);
      
        
        // theo cong thuc benzier curver
        // chia nhỏ tập 4 điểm này thành các điểm nhỏ hơn với numberOfPoint là số điểm
        let num = 1 /(numberOfPoint - 1);
        // tinh vi tri tai tung khoang thoi gian
        for (let i = 0; i < numberOfPoint; i++)
        {
            let num2 = i * num;
            let num3 = (1 - num2);
            let x = (num3 * num3 * num3 * tempPoint0.x) + (3 * num3 * num3 * num2 * tempPoint1.x) + (3 * num3 * num2 * num2 * tempPoint2.x)  + (num2 * num2 * num2 * tempPoint3.x);

            let y = (num3 * num3 * num3 * tempPoint0.y) + (3 * num3 * num3 * num2 * tempPoint1.y) + (3 * num3 * num2 * num2 * tempPoint2.y) + (num2 * num2 * num2 * tempPoint3.y);

            //  cc.log(x  + "--" + y);
            
            this.pointList.push(cc.v2(x , y));
            if (i != 0){
                let v2 = cc.v2(this.pointList[i -1 ].x - this.pointList[i].x ,this.pointList[i - 1].y - this.pointList[i].y);
                
                returnDistanceList.push(v2.mag());
            }
        }
        return returnDistanceList;
    },
    GetSumDistance(distanceList)
    {
        let sum = 0;
        for(let i = 0;i< distanceList.length;i++)
        {
            sum += distanceList[i];
        }
        return sum;
    },

    GetTimeMoveList(distanceList,totalDistance,duration)
    {
        //float totalTime = 0;
        let returnTotalTimeList = [];
        returnTotalTimeList.push(this.totalTime);
        for(let i = 0;i<distanceList.length;i++)
        {
            let timeMove = duration * distanceList[i] / totalDistance;
            this.totalTime += timeMove;
            returnTotalTimeList.push(this.totalTime);
        }
        return returnTotalTimeList;
    },


    /*
     * Lay diem thu 1 trong path
     */
    GetPoint1ByRadis( startVector, endVector,radius)
    {
        let vectorPath = endVector.subSelf(startVector);
        // Vector thang goc 
        let perpendicularVector = cc.v2(-vectorPath.y, vectorPath.x);
        //        Vector2 newStartPoint = startVector + Vector2.Distance(endVector, startVector) * vectorPath.normalized * 1 / 3;
        let endPoint =startVector.addSelf((perpendicularVector.normalizeSelf().mulSelf(radius)));
        return endPoint;
    },

    GetPoint2ByRadis( startVector,  endVector,  radius)
    {
        let vectorPath = endVector.subSelf(startVector);
        // Vector thang goc 
        let perpendicularVector = cc.v2(-vectorPath.y, vectorPath.x).normalizeSelf();
        //        Vector2 newStartPoint = startVector + Vector2.Distance(endVector, startVector) * vectorPath.normalized * 2 / 3;
        let endPointX = startVector.x + perpendicularVector.x*radius;
        let endPointY = startVector.y + perpendicularVector.y*radius;
     //    = startVector.addSelf((perpendicularVector.normalizeSelf().mulSelf(radius)));

        return cc.v2(endPointX ,endPointY);
    },

     GetPoint1BySymmectricCenter( point, center)
    {
        let resultX = center.x + (center.x - point.x);
        let resultY = center.y + (center.y - point.y);
        return cc.v2(resultX , resultY);
    },

     GetStartOldPath()
    {
        return this.cachePoint;
    },

    GetPosByTime(currentTime,isRotate = true)
    {
        let countTarget = 1;
        for (let i = 1; i < this.timeMoveList.length; i++) {
            if (currentTime < this.timeMoveList [i]) {
                currentTime -= this.timeMoveList [i - 1];
                countTarget = i;
                break;
            }
        }

     
        let direction = cc.v2(this.pointList [countTarget].x -   this.pointList[countTarget - 1].x , this.pointList [countTarget].y -   this.pointList[countTarget - 1].y);
       
       // let pos = this.pointList [countTarget - 1].clone().addSelf(direction.mulSelf(currentTime / (this.timeMoveList [countTarget] - this.timeMoveList [countTarget - 1])));
        let posX = this.pointList [countTarget - 1].x + (direction.x* currentTime / (this.timeMoveList [countTarget] - this.timeMoveList [countTarget - 1]));
        let posY = this.pointList [countTarget - 1].y + (direction.y* currentTime / (this.timeMoveList [countTarget] - this.timeMoveList [countTarget - 1]));
        let newPosX = cc.v2(posX , posY);
        let angleValue =  Math.atan2(direction.x , direction.y) * -180 /   Math.PI;
        let hadRotate = false;
      
        if(isRotate)
        {    
            this.OwnerObject.node.angle = angleValue;
        }
            // //rotation image fish
            if (angleValue <= 0 && angleValue >= -180) {
                this.OwnerObject.SetFoward();                
            } else {
                this.OwnerObject.SetInverse();
                hadRotate = true;          
            }
        
            return { newPosX,hadRotate};
    },

    GetSpeedAnimationPath(speed)
    {
        let speedAnimation = (this.totalDictance / this.totalTime) / speed;
        if (speedAnimation < 0.5)
        speedAnimation = 0.5;
        return speedAnimation;
    }

});
module.exports = PathProperties;
