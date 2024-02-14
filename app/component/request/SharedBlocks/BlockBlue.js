sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlue = BlockBase.extend("project1.component.request.SharedBlocks.BlockBlue", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "project1.component.request.SharedBlocks.BlockBlue",
						type: "XML"
					},
					Expanded: {
						viewName: "project1.component.request.SharedBlocks.BlockBlue",
						type: "XML"
					}
				}
			},
			renderer: {}
		});

		return BlockBlue;

	});
