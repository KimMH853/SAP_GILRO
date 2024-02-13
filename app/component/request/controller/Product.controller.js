sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/uxap/ObjectPageHeader",
    "sap/uxap/ObjectPageHeaderActionButton",
    "sap/m/Label",
    "sap/m/Text"
], function(Controller, ObjectPageHeader, ObjectPageHeaderActionButton, Label, Text) {
    "use strict";

    return Controller.extend("project1.component.request.controller.Product", {
        onInit: function() {
            var oObjectPage = this.getView().byId("ObjectPageLayout");

           
            var oHeaderTitle = new ObjectPageHeader({
                objectTitle: "John Smith",
                actions: [
                    new ObjectPageHeaderActionButton({icon: "sap-icon://edit", text: "Edit"}),
                    new ObjectPageHeaderActionButton({icon: "sap-icon://save", text: "Save"})
                ]
            });
            oObjectPage.setHeaderTitle(oHeaderTitle);

            
            oObjectPage.addHeaderContent(new Label({text: "Personal description"}));
            oObjectPage.addHeaderContent(new Text({text: "some KPI info"}));
        }
    });
});