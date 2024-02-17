sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageBox, Fragment, Filter, FilterOperator) {
    "use strict";
    let Today, CreateNum, product_number;
    return Controller.extend("project1.component.request.controller.CreateOrder", {
        onInit: function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateOrder");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

           
            // var oModel = new JSONModel({
            //     items: [
            //         { name: "키보드" },
            //         { name: "마우스" },
            //         { name: "커피" }
            //     ]
            // });
            // this.getView().setModel(oModel);
        },
        onMyRoutePatternMatched: async function () {
            this.onClearField();

            const Product = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Product"
            });
           
            let oProductModel = new JSONModel(Product.value);
            this.getView().setModel(oProductModel, "oProductModel");
            console.log(oProductModel);


            CreateNum = window.location.href.slice(-5);
            let now = new Date();
            Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0')
                + "-" + now.getDate().toString().padStart(2, '0');
            this.getView().byId('ReqNum').setText(CreateNum);
            this.getView().byId('ReqDate').setText(Today);
        },
        onCreate: async function () {
            console.log("onCreate")
            console.log(typeof(product_number));
            let temp = new JSONModel(this.temp).oData;

            temp.product_number = parseInt(product_number);
            //temp.request_quantity = parseInt(this.byId("ReqQty").getValue());
            temp.request_quantity = parseInt(this.getView().byId("ReqQty").getValue().replace(/,/g, ''));
            temp.requestor = this.byId("Requester").getValue();
            temp.request_reason = this.byId("ReqReason").getValue();
            temp.request_number = parseInt(CreateNum);
            temp.request_state = "B";
            temp.request_date = Today;
            //temp.product_price = parseInt(this.byId("ReqPrice").getValue().replace(/,/g, ''));
            await fetch("/odata/v4/request/Request", {
                method: "POST",
                body: JSON.stringify(temp),
                headers: {
                    "Content-Type": "application/json;IEEE754Compatible=true",
                },
            })
            this.onBack();
        },
        onBack() {
            this.getOwnerComponent().getRouter().navTo("Request");
        },
        onClearField: function () {
            this.getView().byId("ReqGood").setValue("");
            this.getView().byId("ReqQty").setValue("");
            this.getView().byId("Requester").setValue("");
            //this.getView().byId("ReqPrice").setValue("");
            this.getView().byId("ReqReason").setValue("");
        },

        onInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();

            if (/^[,\d]*$/.test(sValue)) {
                sValue = sValue.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                oInput.setValue(sValue);
            } else {
                MessageBox.warning("숫자만 입력하세요.");
                oInput.setValue(sValue.replace(/[^\d,]/g, ''));
            }
        },
        onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "project1.component.request.view.fragment.ValueHelpDialogProductPick",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("product_name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("product_name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("ReqGood").setValue(oSelectedItem.getTitle());
            console.log(oSelectedItem.getDescription()); 
            product_number = oSelectedItem.getDescription();
		}
 
        
    });
});
