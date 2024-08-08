Draw.loadPlugin(function(ui) {
    // Function to update shape properties based on metadata
    function updateShapeProperties(cell) {
        var graph = ui.editor.graph;
        var model = graph.getModel();

        model.beginUpdate();
        try {
            // Get the cell value (which is an mxCell object)
            var value = model.getValue(cell);
            if (value !== null && typeof value === 'object') {
                // Iterate over all attributes (custom properties) in the cell value
                var attrs = value.attributes;
                for (var i = 0; i < attrs.length; i++) {
                    var attribute = attrs[i];
                    var propertyName = attribute.nodeName;
                    var propertyValue = attribute.nodeValue;

                    // Update shape properties based on custom properties
                    var style = model.getStyle(cell);
                    var newStyle = mxUtils.setStyle(style, propertyName, propertyValue);
                    model.setStyle(cell, newStyle);
                }
            }
        } finally {
            model.endUpdate();
        }
    }

    // Add listener to handle cell creation and changes
    ui.editor.graph.model.addListener(mxEvent.CHANGE, function(sender, evt) {
        var changes = evt.getProperty('edit').changes;
        for (var i = 0; i < changes.length; i++) {
            var change = changes[i];
            if (change.constructor === mxCellAttributeChange) {
                updateShapeProperties(change.cell);
            }
        }
    });

    // Initial application of the update to existing cells
    var cells = ui.editor.graph.getModel().cells;
    for (var id in cells) {
        updateShapeProperties(cells[id]);
    }
});
