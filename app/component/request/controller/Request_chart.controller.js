sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("project1.component.request.controller.Request_chart", {
        onInit: function () {
            var oData =
            {
                wait: 0,
                waitpercent: '',
                approve: 0,
                approvepercent: '',
                reject: 0,
                rejectpercent: '',
            }
                ;
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "state");
            this.onDataView();
        },
        onRequesthome: function () {
            this.getOwnerComponent().getRouter().navTo("Request_home");
        },

        onDataView: async function () {
            var view = this.getView()
            //var oMonth = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
            //var oMonth = new Date().getFullYear() + "-" + ('0' + (new Date().getMonth() + 1)).slice(-2);
            var month = new Date().getMonth() + 1;
            var oMonth = new Date().getFullYear() + "-" + (month < 10 ? '0' : '') + month;
            console.log(oMonth)
            const Request = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Request?$filter=contains(request_date,'" + oMonth + "')"
            })
            console.log(Request.value);
            let RequestModel = new JSONModel(Request.value);
            view.setModel(RequestModel, "RequestModel");
            let data = view.getModel("RequestModel");
            let a = 0.00, b = 0.00, c = 0.00;
            for (let i = 0; i < data.oData.length; i++) {
                let state = '/' + i + '/request_state'
                if (data.getProperty(state) === 'A') {
                    a++;
                }
                if (data.getProperty(state) === 'B') {
                    b++;
                }
                if (data.getProperty(state) === 'C') {
                    c++;
                }
            }
            
            const aData = String(a / data.oData.length * 100)
            view.getModel("state").setProperty("/approve", a / data.oData.length * 100);
            view.getModel("state").setProperty("/wait", b / data.oData.length * 100);
            view.getModel("state").setProperty("/reject", c / data.oData.length * 100);
            view.getModel("state").setProperty("/approvepercent",   (a / data.oData.length* 100).toFixed(0) + '%');
            //view.getModel("state").setProperty("/approvepercent", 42 + '%');
            view.getModel("state").setProperty("/waitpercent", (b / data.oData.length * 100).toFixed(0) + '%');
            view.getModel("state").setProperty("/rejectpercent", (c / data.oData.length * 100).toFixed(0) + '%');

            console.log((b / data.oData.length * 100) + '%');

        }


    });
});