sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/Device",
    "project1/model/models"
], function (UIComponent, JSONModel, ResourceModel, Device, models) {
    "use strict";
    return UIComponent.extend("project1.Component", {
        metadata: {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            "rootView": {
                "viewName": "project1.view.App",
                "type": "XML",
                "id": "app",
                manifest: "json"
            }
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
            this.setModel(models.createDeviceModel(), "device");
            var oData = {
                recipient: {
                    name: "World"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);
            var i18nModel = new ResourceModel({
                bundleName: "project1.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
        },
        onTitleChanged: function(event) {
            document.title = event.getParameter("title"); // returns: "My Awesome Products!!"
          },
    });
});