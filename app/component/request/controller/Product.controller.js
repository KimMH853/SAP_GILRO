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
    return Controller.extend("project1.component.request.controller.Product", {
        formatter: formatter,

        onInit: function() {
            const productRoute = this.getOwnerComponent().getRouter().getRoute("Product");
            
            productRoute.attachPatternMatched(this.onProductRoutePatternMatched, this);

            var oObjectPage = this.getView().byId("ObjectPageLayout");
            
           
            var oHeaderTitle = new ObjectPageHeader({
                objectTitle: "물품",
                actions: [
                    new ObjectPageHeaderActionButton({icon: "sap-icon://edit", text: "Edit"}),
                    new ObjectPageHeaderActionButton({icon: "sap-icon://save", text: "Save"})
                ]
            });
            oObjectPage.setHeaderTitle(oHeaderTitle);


            
            // oObjectPage.addHeaderContent(new Label({text: "Personal description"}));
            // oObjectPage.addHeaderContent(new Text({text: "some KPI info"}));
        },
        onProductRoutePatternMatched: async function () {
            
            this.onClearField();
            this.onDataView();
            
        },

        onDataView: async function () {
            const Product = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Product"
            });
           
            let oProductModel = new JSONModel(Product.value);
            this.getView().setModel(oProductModel, "oProductModel");
            //console.log(oProductModel);
            //console.log(oProductModel.oData.length);
            const productOder = oProductModel.oData;
            const productOderIndex = productOder.length;
            totalNumber = productOderIndex;
            const CreateNum = productOder[productOderIndex - 1].product_number + 1
            console.log(CreateNum);
            this.getView().byId('productNum').setText(CreateNum);
        },

        onParentBlockModeChange: function (sMode) {
			// this.oParentBlock is available here
		},

        onRegisterProduct: async function() {
            console.log("hi");
            // SimpleForm에서 입력된 값을 가져옵니다.
            var sProductId = this.getView().byId("productNum").getText();
            var sProductName = this.getView().byId("productNameInput").getValue();
            var sQuantity = this.getView().byId("quantityInput").getValue();
            var sCategory = this.getView().byId("categoryInput").getSelectedItem().getKey();
            var sPrice = this.getView().byId("priceInput").getValue();
        
            // 여기서는 입력된 데이터를 콘솔에 출력합니다.
            console.log("Product ID:", sProductId);
            console.log("Product Name:", sProductName);
            console.log("Quantity:", sQuantity);
            console.log("Category:", sCategory);
            console.log("Price:", sPrice);
        
            let temp = new JSONModel(this.temp).oData;
            let now = new Date();
            let Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0')
                + "-" + now.getDate().toString().padStart(2, '0');
            temp.product_number = parseInt(this.getView().byId("productNum").getText());
            temp.product_name = this.byId("productNameInput").getValue();
            temp.product_quantity = parseInt(this.getView().byId("quantityInput").getValue().replace(/,/g, ''));
            temp.product_category = this.byId("categoryInput").getSelectedItem().getKey();
            temp.product_price = parseInt(this.getView().byId("priceInput").getValue().replace(/,/g, ''));;
            temp.product_date = Today;
            
            fetch("/odata/v4/request/Product", {
                method: "POST",
                body: JSON.stringify(temp),
                headers: {
                    "Content-Type": "application/json;IEEE754Compatible=true",
                },
            })
            .then(response => {
                // 서버로부터 받은 응답을 JSON 형태로 파싱합니다.
                return response.json();
            })
            .then(data => {
                // 파싱된 데이터를 콘솔에 출력합니다.
                console.log("Response from server:", data);
            })
            .catch(error => {
                // 오류가 발생한 경우 콘솔에 오류 메시지를 출력합니다.
                console.error("Error:", error);
            });

            this.onClearField();
            this.onDataView();
            
        },
        onDeleteProduct: async function () {
            console.log("delete");
            let model = this.getView().getModel("oProductModel");
            console.log(model);
            let i;
            for (i = 0; i < totalNumber; i++) {
                let chk = '/' + i + '/CHK'
                if (model.getProperty(chk) === true) {
                    let key = '/' + i + '/product_number'
                    console.log(key);
                    let product_number = model.getProperty(key);
                    console.log(product_number);
                    await this.onDelete(product_number);
                }
            }
            
           
        },
        onDelete: async function (key) {
            let url = `/odata/v4/request/Product(product_number=${key})`;
            await fetch(url, {
                method: "DELETE",

            });
            this.onClearField();
            this.onDataView();
        },
        onUpdateProduct: function () {
            var oView = this.getView();
            if (!this.nameDialog) {
                this.nameDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "project1.component.request.view.fragment.UpdateProductDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.nameDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onClearField: function () {
            this.getView().byId("productNameInput").setValue("");
            this.getView().byId("quantityInput").setValue("");
            this.getView().byId("categoryInput").setSelectedItem(null);
            this.getView().byId("priceInput").setValue("");
            ;
        },
    });
});