
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",

], function (Controller, formatter, Filter, FilterOperator, Fragment, Sorter, JSONModel, Spreadsheet, exportLibrary) {
    "use strict";

    let totalNumber;
    const EdmType = exportLibrary.EdmType;
    return Controller.extend("project1.component.request.controller.Request", {
        formatter: formatter,

        onInit: async function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("Request");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched: async function () {
            this.onClearField();
            this.onDataView();
        },
        onDataView: async function () {
            const Request = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Request"
            });
            let RequestModel = new JSONModel(Request.value);
            this.getView().setModel(RequestModel, "RequestModel");
            totalNumber = this.getView().getModel("RequestModel").oData.length;

            let TableIndex = "물품 요청 목록 ( " + totalNumber + " )";
            this.getView().byId("TableName").setText(TableIndex);
        },

        onSearch: function () {
            let ReqNum = this.byId("ReqNum").getValue();
            let ReqGood = this.byId("ReqGood").getValue();
            let Requester = this.byId("Requester").getValue();
            let ReqDate = this.byId("ReqDate").getValue();
            let ReqStatus = this.byId("ReqStatus").getSelectedKey();
            if (ReqDate) {
                let ReqYear = ReqDate.split(". ")[0];
                let ReqMonth = ReqDate.split(". ")[1].padStart(2, '0');
                ReqDate = ReqYear + "-" + ReqMonth;
            }
            var aFilter = [];
            if (ReqNum) { aFilter.push(new Filter("request_number", FilterOperator.Contains, ReqNum)) }
            if (ReqGood) { aFilter.push(new Filter("request_product", FilterOperator.Contains, ReqGood)) }
            if (Requester) { aFilter.push(new Filter("requestor", FilterOperator.Contains, Requester)) }
            if (ReqDate) { aFilter.push(new Filter("request_date", FilterOperator.Contains, ReqDate)) }
            if (ReqStatus) { aFilter.push(new Filter("request_state", FilterOperator.Contains, ReqStatus)) }
            let oTable = this.byId("RequestTable").getBinding("rows");
            oTable.filter(aFilter);
        },
        onCreateOrder: function () {
            let CreateOrder = this.getView().getModel("RequestModel").oData;
            let CreateOrderIndex = CreateOrder.length;
            let CreateNum = CreateOrder[CreateOrderIndex - 1].request_number + 1
            this.getOwnerComponent().getRouter().navTo("CreateOrder", { num: CreateNum });
        },
        onClearField: function () {
            this.getView().byId("ReqNum").setValue("");
            this.getView().byId("ReqGood").setValue("");
            this.getView().byId("Requester").setValue("");
            this.getView().byId("ReqDate").setValue("");
            this.getView().byId("ReqStatus").setSelectedKey("");
        },
        onReset() {
            this.onClearField();

            this.onSearch();

            // let aFilter = [];
            // let oTable = this.byId("RequestTable").getBinding("rows");
            // oTable.filter(aFilter);
        },
        onSort: function () {
            if (!this.byId("SortDialog")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "project1.component.request.view.fragment.SortDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open("filter");
                }.bind(this));
            } else {
                this.byId("SortDialog").open("filter");
            }
            this.onSearch();
        },
        onConfirmSortDialog: function (oEvent) {
            let mParams = oEvent.getParameters();
            let sPath = mParams.sortItem.getKey();
            let bDescending = mParams.sortDescending;
            let aSorters = [];
            aSorters.push(new Sorter(sPath, bDescending));
            let oBinding = this.byId("RequestTable").getBinding("rows");
            oBinding.sort(aSorters);
        },

        onCreateOrder: function () {
            console.log(this.getView().getModel("RequestModel"));
            let CreateOrder = this.getView().getModel("RequestModel").oData;
            let CreateOrderIndex = CreateOrder.length;
            let CreateNum = CreateOrder[CreateOrderIndex - 1].request_number + 1
            this.getOwnerComponent().getRouter().navTo("CreateOrder", { num: CreateNum });
        },
        onClearField: function () {
            this.getView().byId("ReqNum").setValue("");
            this.getView().byId("ReqGood").setValue("");
            this.getView().byId("Requester").setValue("");
            this.getView().byId("ReqDate").setValue("");
            this.getView().byId("ReqStatus").setSelectedKey("");
        },

        onShowRejectReason: function (oEvent) {
            let SelectedNumID = oEvent.getParameters().id.slice(-2);
            let oBinding = this.getView().byId("RequestTable").getBinding("rows");
            let SelectedIndex = parseInt(SelectedNumID / 8);
            console.log(oEvent.getParameters().id);
            console.log(SelectedNumID);
            console.log(oBinding);
            console.log(SelectedIndex);
            if (isNaN(SelectedNumID)) {
                SelectedIndex = 0;
            }
            let RejectReason = oBinding.oList[SelectedIndex].request_reject_reason;
            var oView = this.getView();
            if (!this.nameDialog) {
                this.nameDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "project1.component.request.view.fragment.ShowRejectDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.nameDialog.then(function (oDialog) {
                oDialog.open();
                oView.byId("RejectReasonCheck").setText(RejectReason);
            });
        },
        onCancelRejectReason: function () {
            this.byId("ShowRejectDialog").destroy();
            this.nameDialog = null;
        },
        onNavToDetail: function (oEvent) {
            let SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
            this.getOwnerComponent().getRouter().navTo("OrderDetail", { num: SelectedNum });
            console.log(SelectedNum);
        },
        onDeleteOrder: async function () {
            let model = this.getView().getModel("RequestModel");
            let i;
            for (i = 0; i < totalNumber; i++) {
                let chk = '/' + i + '/CHK'
                if (model.getProperty(chk) === true) {
                    let key = '/' + i + '/request_number'
                    let request_number = model.getProperty(key);
                    await this.onDelete(request_number);
                }
            }
            this.onDataView();
        },
        // onDelete: async function (key) {
        //     let url = "/odata/v4/request/Request" + key;
        //     await fetch(url, {
        //         method: "DELETE",
        //         headers: {
        //             "Content-Type": "application/json;IEEE754Compatible=true"
        //         }
        //     })
        // },
        onDelete: async function (key) {
            let url = `/odata/v4/request/Request(request_number=${key})`;
            await fetch(url, {
                method: "DELETE",

            });
        },

        onRequesthome: function () {
            this.getOwnerComponent().getRouter().navTo("Request_home");
        },

        onDataExport: function () {
            let aCols, oRowBinding, oSettings, oSheet, oTable;
            oTable = this.byId('RequestTable');
            oRowBinding = oTable.getBinding('rows');
            aCols = this.createColumnConfig();
            let oList = [];
            for (let j = 0; j < oRowBinding.oList.length; j++) {
                if (oRowBinding.aIndices.indexOf(j) > -1) {
                    oList.push(oRowBinding.oList[j]);
                }
            }
            for (let i = 0; i < oList.length; i++) {
                if (oList[i].request_state === 'A') {
                    oList[i].request_state = '승인';
                }
                if (oList[i].request_state === 'B') {
                    oList[i].request_state = '처리 대기';
                }
                if (oList[i].request_state === 'C') {
                    oList[i].request_state = '반려';
                }
            }
            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'RequestTable.xlsx',
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
        
        createColumnConfig: function () {
            const aCols = [];
            aCols.push({
                label: '요청 번호',
                property: 'request_number',
                type: EdmType.Int32
            });
            aCols.push({
                label: '요청 물품',
                property: 'request_product',
                type: EdmType.String
            });
            aCols.push({
                label: '물품 개수',
                property: 'request_quantity',
                type: EdmType.Int32
            });
            aCols.push({
                label: '요청자',
                property: 'requestor',
                type: EdmType.String
            });
            aCols.push({
                label: '요청 일자',
                property: 'request_date',
                type: EdmType.String
            });
            aCols.push({
                label: '처리 상태',
                property: 'request_state',
                type: EdmType.String
            });
            return aCols;
        }

    });
});
