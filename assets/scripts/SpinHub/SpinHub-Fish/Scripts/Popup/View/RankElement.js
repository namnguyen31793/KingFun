cc.Class({
    extends: cc.Component,

    properties: {
        nameText : cc.Label,
        valueText : cc.Label,
		imgAva: cc.Sprite,
		imgFish: cc.Sprite,
    },

    Show(data){
        cc.log(data);
        this.node.active = true;
		this.nameText.string = "User_"+data.AccountId;
        this.valueText.string = Global.Helper.formatNumber(data.Reward);
        Global.Helper.GetAvataOtherById(this.imgAva, data.AccountId);
        var listDataFish = getFValue(data.Description);
        cc.log(listDataFish);
        if(listDataFish != null)    
            Global.Helper.GetFishIconLobby(listDataFish, this.imgFish);
    },

    ClearElement(){
        this.node.active = false;
		this.nameText.string = "";
        this.valueText.string =  "";
    },
});

function getFValue(inputString) {
  // Tách chuỗi bằng dấu cách "|"
  const parts = inputString.split('|');

  // Duyệt qua các phần tử của mảng để tìm phần tử chứa giá trị F
  for (const part of parts) {
    if (part.includes('F :')) {
      // Tách chuỗi bằng dấu hai chấm ":"
      const fValue = part.split(':')[1];
      return parseInt(fValue);
    }
  }

  // Trả về giá trị mặc định nếu không tìm thấy F trong chuỗi đầu vào
  return null;
}
