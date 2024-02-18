sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/uxap/ObjectPageHeader",
    "sap/uxap/ObjectPageHeaderActionButton",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "../model/formatter", 
], function(Controller, ObjectPageHeader, ObjectPageHeaderActionButton, Label, Text, JSONModel, formatter) {
    "use strict";
   
    let totalNumber;
    return Controller.extend("project1.component.request.controller.ProductDetail", {
        formatter: formatter,

        onInit: function() {
            const productDetailRoute = this.getOwnerComponent().getRouter().getRoute("ProductDetail");
            
            productDetailRoute.attachPatternMatched(this.onProductDetailRoutePatternMatched, this);

            var oViewModel = new JSONModel({
                editMode: false
            });
            this.getView().setModel(oViewModel, "viewModel");

            
        },

        onProductDetailRoutePatternMatched: async function () {
            let SelectedNum = window.location.href.slice(-4);
            console.log(SelectedNum);
            const Product = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Product?$filter=product_number eq " + SelectedNum
            });
            let oProductModel = new JSONModel(Product.value);
            this.getView().setModel(oProductModel, "oProductModel");
            console.log(oProductModel.oData[0]);
            
            // let visibleMode = new JSONModel({ footer: false, reject: false });
            // if (RequestModel.oData[0].request_state == 'B') {
            //     visibleMode.oData.footer = true;
            // } else if (RequestModel.oData[0].request_state == 'C') {
            //     visibleMode.oData.reject = true;
            // }
            
            //this.getView().setModel(oProductModel, "oProductModel");
        },

        onSave: async function() {
            var oViewModel = this.getView().getModel("viewModel");
            
            
            let now = new Date();
            let Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0')
                + "-" + now.getDate().toString().padStart(2, '0');
            
        
            // 수정된 물품 정보 가져오기
            var sProductId = parseInt(this.getView().byId("productNum").getText());
            var sProductName = this.getView().byId("productNameInput").getValue();
            var sProductQuantity = parseInt(this.getView().byId("quantityInput").getValue());
            var sProductCategory = this.getView().byId("categoryInput").getValue();
            var sProductPrice = parseInt(this.getView().byId("priceInput").getValue());
            console.log(sProductId);
            console.log(sProductName);
            console.log(sProductQuantity);
            console.log(sProductCategory);
            console.log(sProductPrice);
            // 수정된 정보를 서버에 업데이트
            try {
                await fetch(`/odata/v4/request/Product(product_number=${sProductId})`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        product_name: sProductName,
                        product_quantity: sProductQuantity,
                        product_category: sProductCategory,
                        product_price: sProductPrice,
                        product_date: Today
                    })
                });
        
                // 수정 모드 해제
                oViewModel.setProperty("/editMode", false);
        
                // 저장이 성공적으로 이루어졌음을 사용자에게 알림
                sap.m.MessageToast.show("물품 정보가 성공적으로 저장되었습니다.");
            } catch (error) {
                // 저장 중 오류 발생 시 사용자에게 알림
                sap.m.MessageToast.show("물품 정보를 저장하는 중 오류가 발생했습니다.");
                console.error("Error saving product information:", error);
            }
        },
        onEdit: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var bEditMode = oViewModel.getProperty("/editMode");
            oViewModel.setProperty("/editMode", !bEditMode); // 현재 값의 반대로 토글
        },

        onCancel: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editMode", false); // 수정 모드 해제
        }
        
    });
});