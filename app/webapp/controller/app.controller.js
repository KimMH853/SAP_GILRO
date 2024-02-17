sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller) {
    "use strict";
    return Controller.extend("project1.controller.app", {

        onHome: function () {
            this.getOwnerComponent().getRouter().navTo("home");
        },
        
        onRequest: function () {
            this.getOwnerComponent().getRouter().navTo("request");
        },
        
        onReqeustPage: function() {
           console.log("onReqeustPage")
            this.getOwnerComponent().getRouter().navTo("request");
        },
        
        onRequestChartpage: function() {
           
            this.getOwnerComponent().getRouter().navTo("RequestChartPage");
        },
        
        onProductPage: function() {
            
            this.getOwnerComponent().getRouter().navTo("ProductPage");
        }


    });
});