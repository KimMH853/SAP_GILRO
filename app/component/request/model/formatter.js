sap.ui.define([], function () {
    "use strict";
    return {
        statusText: function (sStatus) {
            switch (sStatus) {
                case "A":
                    return "승인"
                case "B":
                    return "처리 대기";
                case "C":
                    return "반려";
                default:
                    return sStatus;
            }
        },

        formatNumberWithCommas: function(sValue) {
            
            console.log("포멧넘버");
            console.log(sValue);
            console.log(typeof(sValue));
            
            return sValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
        },

        categoryText: function (sStatus) {
            switch (sStatus) {
                case "A":
                    return "컴퓨터 주변기기"
                case "B":
                    return "다과";
                case "C":
                    return "문구";
                default:
                    return sStatus;
            }
        },
    };
});