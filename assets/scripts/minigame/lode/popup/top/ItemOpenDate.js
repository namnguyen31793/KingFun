/*******
 * Generated by nemo
 * on 2/22/20
 * version
 ********/
(function () {
    cc.ItemOpenDate = cc.Class({
        extends: cc.Component,
        properties: {
            lbOpenDate: cc.Label,
            dateValue: "",
            strDateUI:""
        },
        setValueOpenDate: function (data) {
            this.lbOpenDate.string = data.strOpenDate;
            this.dateValue = data.dateValue;
            this.strDateUI = data.strOpenDate;
            this.node.on('touchend', function() {
                //Goi service voi ngay click
                cc.LodePopupController.getInstance().getTopOnOpenDate(this.dateValue, this.strDateUI);
            }, this)
        },
    })
}).call(this)