/**
 * @author Michael White
 * @copyright 2017 Freckle, LLC
 */

/**
 * Update the size and position of any selected button symbols.
 *
 * @param layers A Sketch Layers object. (NOT AN ARRAY)
 * @returns {boolean}
 * @private
 */
function _updateButtonSymbols(layers) {
    for(var k = 0; k < layers.count(); k++) {
        //reference each layer of each artboard
        var layer = layers[k];

        // Check to see if the layer is a Symbol (this operation only works for symbols)
        var symbol = getSymbolForLayer(layer);
        if(symbol) {
            var symbolMaster = symbol.symbolMaster();
            var masterChildren = symbolMaster.children();
            var masterChildrenCount = masterChildren.count();

            var allOverrides = layer.overrides();

            if(!allOverrides || !allOverrides.count()) {
                continue; // No point continuing - no overrides set
            }

            var overrides = allOverrides.objectForKey(0); // key of 0 assumes single level of depth for symbol
            // NOTE: If an offset is positive the offset anchor is either top or left. If an offset is negative the offset anchor is bottom or right.
            var positionX = 0;
            var positionY = 0;
            var paddingH = 0;
            var paddingV = 0;
            var labelLayer = null;
            var labelTextOverride = '';
            var templateLabelWidth = 0;
            var templateLabelHeight = 0;
            var templateBackgroundWidth = 0;
            var templateBackgroundHeight = 0;

            // Loop the children of the symbol to find the layers that provide the override values we want.
            for(var i = 0; i < masterChildrenCount; i++) {
                var childLayer = masterChildren[i];
                var childName = childLayer.name();
                var childObjectId = childLayer.objectID();
                switch(childName + '') {
                    case 'Label':
                        templateLabelWidth = childLayer.frame().width();
                        templateLabelHeight = childLayer.frame().height();
                        labelLayer = childLayer;
                        labelTextOverride = overrides[childObjectId];
                        break;
                    case 'Position-X':
                        if(overrides[childObjectId]) {
                            positionX = overrides[childObjectId];
                        }
                        if(!positionX) {
                            if(childLayer.class() == 'MSTextLayer') {
                                positionX = childLayer.stringValue();
                            }
                        }
                        break;
                    case 'Position-Y':
                        if(overrides[childObjectId]) {
                            positionY = overrides[childObjectId];
                        }
                        if(!positionY) {
                            if(childLayer.class() == 'MSTextLayer') {
                                positionY = childLayer.stringValue();
                            }
                        }
                        break;
                    case 'Padding-H':
                        if(overrides[childObjectId]) {
                            paddingH = parseInt(overrides[childObjectId], 10);
                        }
                        if(!paddingH) {
                            if(childLayer.class() == 'MSTextLayer') {
                                paddingH = parseInt(childLayer.stringValue().trim(), 10);
                            }
                        }
                        break;
                    case 'Padding-V':
                        if(overrides[childObjectId]) {
                            paddingV = parseInt(overrides[childObjectId], 10);
                        }
                        if(!paddingV) {
                            if(childLayer.class() == 'MSTextLayer') {
                                paddingV = parseInt(childLayer.stringValue().trim(), 10);
                            }
                        }
                        break;
                    case 'Background':
                        templateBackgroundWidth = childLayer.frame().width();
                        templateBackgroundHeight = childLayer.frame().height();
                        break;
                }
            }

            // Store the master symbol's label text
            var defaultSymbolTextLayerValue = labelLayer.stringValue();
            if(labelTextOverride == '' || labelTextOverride == null) {
                labelTextOverride = defaultSymbolTextLayerValue;
            }

            if(!paddingH) {
                // No default or override horizontal padding. Calculate it from existing dimensions in the master symbol.
                paddingH = (templateBackgroundWidth - templateLabelWidth) / 2;
            }

            if(!paddingV) {
                // No default or override vertical padding. Calculate it from existing dimensions in the master symbol.
                paddingV = (templateBackgroundHeight - templateLabelHeight) / 2;
            }

            // If no existing x or y position is set, treat the center position of this symbol as the anchor point for the resize
            var maintainCenterH = false;
            var maintainCenterV = false;
            var centerToParentH = false;
            var centerToParentV = false;
            positionX = positionX.toString().trim();
            positionY = positionY.toString().trim();
            switch(positionX) {
                case 'center':
                    centerToParentH = true;
                    break;
                case 'left':
                case 'right':
                    break;
                default:
                    positionX = parseInt(positionX, 10);
                    if(!positionX) {
                        maintainCenterH = true;
                    }
                    break;
            }
            switch(positionX) {
                case 'center':
                    centerToParentV = true;
                    break;
                case 'top':
                case 'bottom':
                    break;
                default:
                    positionY = parseInt(positionY, 10);
                    if(!positionY) {
                        maintainCenterV = true;
                    }
                    break;
            }

            var currentSymbolWidth = symbol.frame().width();
            var currentSymbolHeight = symbol.frame().height();

            var currentSymbolX = symbol.frame().x();
            var currentSymbolY = symbol.frame().y();

            // Set the master symbol's label text to the value of the override text
            labelLayer.setStringValue(labelTextOverride);

            // Get the updated width and height of the label text
            labelWidth = labelLayer.frame().width();
            labelHeight = labelLayer.frame().height();

            // Restore the master symbol's label text to its initial value
            labelLayer.setStringValue(defaultSymbolTextLayerValue);

            var newSymbolWidth = labelWidth + (paddingH * 2);
            var newSymbolHeight = labelHeight + (paddingV * 2);

            symbol.frame().setWidth(newSymbolWidth);
            symbol.frame().setHeight(newSymbolHeight);

            // Get the container for this symbol
            var group = symbol.parentGroup();

            // Reposition the button within its container as required
            if(!group) {
                return false;
            }

            if(maintainCenterH) {
                // Figure out the left offset as being changed by 1/2 of the change in button width
                positionX = currentSymbolX - ((newSymbolWidth - currentSymbolWidth) / 2);
            } else if(centerToParentH) {
                // Find half the width of the container and subtract half the width of the button
                positionX = (group.frame().width() / 2) - (newSymbolWidth / 2);
            } else {
                switch(positionX) {
                    case 'left':
                        // Position flush with left edge of parent container
                        positionX = 0;
                        break;
                    case 'right':
                        // Use (width of container - button width) to position button flush to right edge of parent container
                        positionX = group.frame().width() - newSymbolWidth;
                        break;
                    default:
                        if(positionX > 0) {
                            // Offset is from left - do nothing special because this is the standard anchor point Sketch uses on resize
                        } else if(positionX < 0) {
                            // Offset is from right; adjust based on current coordinate space
                            positionX = (group.frame().width() - newSymbolWidth) + positionX;
                        }
                        break;
                }
            }

            if(maintainCenterV) {
                // Figure out the left offset as being changed by 1/2 of the change in button width
                positionY = currentSymbolY - ((newSymbolHeight - currentSymbolHeight) / 2);
            } else if(centerToParentV) {
                // Find half the height of the container and subtract half the height of the button
                positionY = (group.frame().height() / 2) - (newSymbolHeight / 2);
            } else {
                switch(positionY) {
                    case 'top':
                        // Position flush with top of parent container
                        positionY = 0;
                        break;
                    case 'bottom':
                        // Use (height of container - button height) to position button flush to bottom of parent container
                        positionY = group.frame().height() - newSymbolHeight;
                        break;
                    default:
                        if(positionY > 0) {
                            // Offset is from top - do nothing special because this is the standard anchor point Sketch uses on resize
                        } else if(positionY < 0) {
                            // Offset is from bottom ; adjust based on current coordinate space
                            positionY = (group.frame().height() - newSymbolHeight) + positionY;
                        }
                        break;
                }
            }

            symbol.frame().setX(positionX);
            symbol.frame().setY(positionY);
        }
    }
}

/**
 * This is the method called when the user runs the plugin from the menu or keyboard shortcut.
 *
 * @param context
 */
function command_updateButtonSymbols(context) {
    var layers = context.selection;
    _updateButtonSymbols(layers);
}

/**
 * Not really used for now. I hope to use this in the future.
 *
 * @param context
 */
function onSelectionChanged(context) {
    // Do nothing for now - maybe we automate this later
    return;
    /*var action = context.actionContext;
     var doc = action.document;
     var layers = action.newSelection;
     _updateButtonSymbols(layers);*/
}

/**
 * Not really used for now. I hope to use this in the future.
 *
 * @param context
 */
function onTextChanged(context) {
    // todo - once this method will actually run we can automate it to update the button symbol the text is part of.
    return;
    /*var action = context.actionContext;
     var doc = action.document;
     doc.showMessage('Text changed in document.');*/
}

/**
 * Utility to determine whether the specified layer is a symbol of any kind (master or instance)
 *
 * @param layer
 * @returns {boolean}
 */
function isSymbol(layer) {
    var className = layer.class();
    return className == 'MSSymbolMaster' || className == 'MSSymbolInstance';
}

/**
 * Utility to get the symbol that the specified layer is part of. If the layer is not in a symbol null is returned.
 *
 * @param layer
 * @returns {*}
 */
function getSymbolForLayer(layer) {
    if(layer) {
        if(isSymbol(layer)) {
            return layer;
        }

        return getSymbolForLayer(layer.parentGroup());
    }

    return null;
}
