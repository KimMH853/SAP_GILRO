sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Dialog",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/Button"
], function(Controller, JSONModel, Dialog, List, StandardListItem, Button) {
  "use strict";

  return Controller.extend("my.namespace.Controller", {

      onValueHelpRequest: function(oEvent) {
          var oInput = oEvent.getSource();
          var oDialog = new Dialog({
              title: "물품 목록",
              contentWidth: "auto",
              contentHeight: "300px",
              resizable: true,
              content: [
                  new List({
                      items: {
                          path: "/Cities",
                          template: new StandardListItem({
                              title: "{cityName}",
                              type: "Active",
                              press: function(oEvent) {
                                  var sSelectedCity = oEvent.getSource().getTitle();
                                  oInput.setValue(sSelectedCity);
                                  oInput.fireLiveChange({
                                      value: sSelectedCity
                                  });
                                  oDialog.close();
                              }
                          })
                      }
                  })
              ],
              beginButton: new Button({
                  text: "Close",
                  press: function() {
                      oDialog.close();
                  }
              }),
              afterClose: function() {
                  oDialog.destroy();
              }
          });

          this.getView().addDependent(oDialog);

          // Adding sample cities for demonstration
          var oModel = new JSONModel({
              Cities: [
                  { cityName: "마우스" },
                  { cityName: "키보드" },
                  { cityName: "커피" },
                  { cityName: "녹차" },
                  { cityName: "A4" }
              ]
          });
          this.getView().setModel(oModel);

          oDialog.open();
      },

      onSubmit: function() {
          var oInput = this.byId("cityInput");
          var sSelectedCity = oInput.getValue();
          
          if (sSelectedCity) {
              alert("Selected city: " + sSelectedCity);
          } else {
              alert("Please select a city.");
          }
      }
      
  });
});
