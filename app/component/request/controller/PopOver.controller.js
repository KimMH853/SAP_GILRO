// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/Popover",
//     "sap/m/Button",
//     "sap/m/Text"
// ], function(Controller, Popover, Button, Text) {
//     "use strict";

//     return Controller.extend("project1.component.request.controller.PopOver", {
//         onInit: function() {
//             // Create popover
//             this._popover = new Popover({
//                 title: "경고",
//                 contentWidth: "200px",
//                 content: [
//                     new Text({ text: "예상 가격에는 숫자만 입력해야 합니다." })
//                 ]
//             });
//         },

//         onInputChange: function(oEvent) {
//             var oInput = oEvent.getSource();
//             var sValue = oInput.getValue();
//             console.log("Input changed");
//             // Check if the input contains only numbers
//             if (!/^\d+$/.test(sValue)) {
//                 // Open popover if input contains non-numeric characters
//                 if (!this._popover.isOpen()) { // Check if popover is not already open
//                     this._popover.openBy(oInput);
//                 }
//             } else {
//                 // Close popover if input contains only numbers
//                 this._popover.close();
//             }
//         },

//         onCreate: function() {
//             // Implement creation logic
//         },

//         onBack: function() {
//             // Implement navigation logic
//         }
//     });
// }); 


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function(Controller, MessageBox) {
    "use strict";

    return Controller.extend("project1.component.request.controller.PopOver", {
        onInputChange: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            
            // Check if the input contains only numbers
            if (!/^\d+$/.test(sValue)) {
                // Display warning message if input contains non-numeric characters
                MessageBox.warning("예상 가격에는 숫자만 입력해야 합니다.");
                // Remove non-numeric characters from the input
                oInput.setValue(sValue.replace(/[^\d]/g, ''));
            }
        },

        formatNumber: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            
            // 숫자 형식으로 변환하여 쉼표를 추가
            sValue = sValue.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // 변경된 값으로 입력 필드를 업데이트
            oInput.setValue(sValue);
        },

        onCreate: function() {
            // Implement creation logic
        },

        onBack: function() {
            // Implement navigation logic
        }
    });
});