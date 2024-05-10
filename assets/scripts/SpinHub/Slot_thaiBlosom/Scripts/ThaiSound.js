cc.Class({
    extends: require("SlotSoundControl"),

    properties: {
		expanderWildSound : cc.AudioClip,
        stayWildSound : cc.AudioClip,
        scatterSound : cc.AudioClip,
       
    },
    Init() {
        this.soundManager = require('SoundManager2').getIns();
        this.soundManager2 = require('SoundManager2').getIns();
        this.SetLink();
    },

    SetLink() {
        this._super();
        this.bgLink = "Sound/BG";
        this.spinLink = "Sound/Spin";
        this.freeLink = "Sound/StartFree";
        this.winMoneyLink = "Sound/Win";
        this.clickLink = "Sound/Click";
        this.spinStart = "Sound/Spin";
    },

    PlaySound(resSound) {
        var seft = this;
        if(this.isPlaySound) {
            this.soundManager.playEffect2("Slot_thaiBlosom", resSound, false, 0.7, true);
        }     
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            this.soundManager.playMusicBackground2("Slot_thaiBlosom", this.bgLink, 1);
    },

   

    PlaySpinStart() {
        this.PlaySound(this.spinStart);
    },

    HandleMatrixSound(matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription)
    {
        if(!this.isPlaySound)
            return;
        let rowSize = 5;
        const matrixAray = this.splitMatrix(matrix, 5);
        if(this.Handle_CheckExanderWild(matrixAray))
        {
            this.scheduleOnce(()=>{
                this.PlaySoundClip("expanderWildSound", this.expanderWildSound);
                // cc.audioEngine.playEffect(this.expanderWildSound, false);       
            } , 1);        
        }
        if(this.checkStayWild(matrix))
        {
            this.scheduleOnce(()=>{
                this.PlaySoundClip("stayWildSound", this.stayWildSound);
                // cc.audioEngine.playEffect(this.stayWildSound, false);       
            } , 1);  
        }
        else if(this.checkElephant(matrix))
        {
            this.scheduleOnce(()=>{
                this.PlaySoundClip("scatterSound", this.scatterSound);
                // cc.audioEngine.playEffect(this.scatterSound, false);       
            } , 1);  
        }
    },

    Handle_CheckExanderWild(matrix)
    {
        // Kiểm tra các cột
        const hasDuplicateColumns = this.checkColumns(matrix);
        return hasDuplicateColumns;
    },


    splitMatrix(matrixString, rowSize) {
        const matrixArray = matrixString.split(',');
        const rows = [];
        for (let i = 0; i < matrixArray.length; i += rowSize) {
          const row = matrixArray.slice(i, i + rowSize);
          rows.push(row);
        }
        return rows;
    },

    checkColumns(matrix) {
        for (let col = 0; col < matrix[0].length; col++) {
          const columnValues = new Set();
          for (let row = 0; row < matrix.length; row++) {
            const value = matrix[row][col];
            if (value == '3' && columnValues.has(value)) {
              return true; // Cột có các số giống nhau
            }
            columnValues.add(value);
          }
        }
        return false; // Không có cột nào có các số giống nhau
      },
    checkStayWild(matrixString)
    {
        let matrixArray = matrixString.split(",");
        let searchString1 = "2.2";
  
        for (let i = 0; i < matrixArray.length; i++) {
            let number = matrixArray[i].trim(); // Loại bỏ khoảng trắng thừa
            
            if (number == searchString1 ) {
              
                return true;
            }
        }  
        
        return false;
    },
    checkElephant(matrixString)
    {
        let rand = Global.RandomNumber(1, 100);
        if(rand > 10)
            return false;
        let matrixArray = matrixString.split(",");
        let searchString1 = "4";
      
        for (let i = 0; i < matrixArray.length; i++) {
            let number = matrixArray[i].trim(); // Loại bỏ khoảng trắng thừa
            
            if (number == searchString1 ) {             
                return true;
            }
        }  
        
        return false;
    }  


    
});