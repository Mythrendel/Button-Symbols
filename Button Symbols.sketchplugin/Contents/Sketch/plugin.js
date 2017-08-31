/**
 * @author Michael White
 * @copyright 2017 Freckle, LLC
 */

function clog() {
    var args = Array.prototype.slice.call(arguments);
    var clogs = _getClogs(args);
    for(var i in clogs) {
        if(clogs.hasOwnProperty(i)) {
            var clogItem = clogs[i];
            console.log(clogItem);
        }
    }
}

function _getClogs(args) {
    var clogs = [];
    var argsLength = args.length;
    if(argsLength && ['function', 'object'].indexOf(typeof(console.log)) >= 0) {
        var scalarTypes = ['string', 'boolean', 'number', 'undefined'];
        var previousClogItemType = '';
        for(var i = argsLength; i >= 1; i--) {
            var clogItem = args[argsLength - i];
            var clogItemType = typeof(clogItem);
            // Is scalar?
            if(scalarTypes.indexOf(clogItemType) >= 0 && scalarTypes.indexOf(previousClogItemType) >= 0) {
                // Concat with previous clog item
                if(clogItemType == 'boolean') {
                    clogItem = '(' + (clogItem ? 'true' : 'false') + ')';
                } else if (clogItemType == 'undefined') {
                    clogItem = '(undefined)';
                }
                clogs[clogs.length - 1] += ': ' + clogItem;
            } else {
                clogs.push(clogItem);
            }
            previousClogItemType = clogItemType;
        }
    }
    return clogs;
}

function _insertButtonSymbol(context) {
    var layers = context.selection;
    clog('_insertButtonSymbol()');
    clog(layers.count());
    for(var k = 0; k < layers.count(); k++) {
        //reference each layer of each artboard
        var layer = layers[k];
        clog('Layer Number', k+1);
        clog(layer.class() + '');
        clog(layer.name() + '');

        clog('is artboard', isArtboard(layer));
        clog('is group', isGroup(layer));
        clog('is text', isText(layer));

        var group = null;
        if(isText(layer)) {
            // The idea here is to get the text layer's value and then replace the text layer with a button instance that contains the text layer's value as its label override.
                /*
                 *
                 * var obj = {};
    obj[<overrideLayerID>] = "overrideText";
    symbolInstance.addOverrides_forCellAtIndex_ancestorIDs_(obj, 0, nil);
                 */
        } else {
            if(isGroup(layer)) {
                clog('GROUP FOUND');
                group = layer;
            } else {
                clog('FINDING PARENT GROUP');
                group = layer.parentGroup();
            }

            // Insert the symbol into the target group.
            var sketch = context.api();
            var symbolUri = sketch.resourceNamed('Symbol.sketch');


	        var sketchFile = MSDocument.new();
	        sketchFile.readFromURL_ofType_error(symbolUri, 'com.bohemiancoding.sketch.drawing', null);

            if(sketchFile) {
                _addSymbolByName(context, sketchFile, group, 'Button');
                sketchFile.close();
            } else {
                context.document.showMessage('Unable to open the Symbol.sketch file in the plugin Resources folder. Try re-installing Button Symbols to repair the plugin.');
            }
        }
    }
}

function _addSymbolByName(context, sourceDocument, targetGroup, symbolName) {
    var sourceSymbols = sourceDocument.documentData().allSymbols();
    var sourceSymbol = _getSymbolByName('Button', sourceSymbols);

    if(sourceSymbol) {
        var previousPage = _goToSymbolsPage(context);
        var sourceSymbolName = sourceSymbol.name() + '';
        // Check that the symbol by the same name doesn't already exist
        var allSymbols = context.document.documentData().allSymbols();
        var tmpSourceSymbol = _getSymbolByName(sourceSymbolName, allSymbols);
        if(!tmpSourceSymbol) {
            context.document.currentPage().addLayers([sourceSymbol]);
            allSymbols = context.document.documentData().allSymbols();
            sourceSymbol = _getSymbolByName(sourceSymbolName, allSymbols);
        } else {
            sourceSymbol = tmpSourceSymbol;
        }
        context.document.setCurrentPage(previousPage);
        // Add symbol instance to the target group
        // todo change how X,Y coordinates are determined.
        //var rect = new Rectangle(0, 0, sourceSymbol.frame().width(), sourceSymbol.frame().height());
        /*var rect = CGRectMake(0, 0, sourceSymbol.frame().width(), sourceSymbol.frame().height());
        var symbolInstance = MSSymbolCreator.createSymbolInstanceWithName_rect_symbolID(sourceSymbolName, rect, sourceSymbol.objectID());
        sourceSymbol.registerInstance(symbolInstance);*/
        // wow... it took WAY TOO LONG to find this: MSSymbolMaster.newSymbolInstance()
        var symbolInstance = sourceSymbol.newSymbolInstance();
        targetGroup.addLayers([symbolInstance]);
    }
}

/**
 * Get a symbol based on its name from a list of provided symbol layers.
 *
 * @param {String} targetSymbolName
 * @param {NSArray} symbols
 * @return {MSSymbolMaster|null}
 */
function _getSymbolByName(targetSymbolName, symbols) {
    for(var i = 0; i < symbols.count(); i++) {
        var tempSymbolName = symbols.objectAtIndex(i).name();
        if(tempSymbolName && tempSymbolName.isEqualToString(targetSymbolName)) {
            return symbols.objectAtIndex(i);
        }
    }

    return null;
}


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

            // 2017-28-08 :: After waiting a while to fix this, turns out that layer.overrides() now returns just the overrides for this layer vs how it returned them in Sketch 43.1
            var overrides = layer.overrides();

            if(!overrides) {
                continue; // No point continuing - no overrides set
            }

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
                var childName = childLayer.name() + '';
                var childObjectId = childLayer.objectID() + '';
                switch(childName) {
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
            switch(positionY) {
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
            var labelWidth = labelLayer.frame().width();
            var labelHeight = labelLayer.frame().height();

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

function command_insertButtonSymbol(context) {
    _insertButtonSymbol(context);
}

/**
 * Not really used for now. I hope to use this in the future.
 *
 * @param context
 */
function onSelectionChanged(context) {
    //clog('running onSelectionChanged()');
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
    //clog('running onTextChanged()');
    // todo - once this method will actually run we can automate it to update the button symbol the text is part of.
    return;
    /*var action = context.actionContext;
     var doc = action.document;
     doc.showMessage('Text changed in document.');*/
}

function _goToSymbolsPage(context) {
    var previousPage = context.document.currentPage();
    context.document.setCurrentPage(context.document.documentData().symbolsPageOrCreateIfNecessary());
    return previousPage;
}

/**
 * Utility to determine whether the specified layer is a symbol of any kind (master or instance)
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isSymbol(layer) {
    var className = layer.class() + '';
    return className == 'MSSymbolMaster' || className == 'MSSymbolInstance';
}

/**
 * Utility to determine whether the specified layer is a symbol instance.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isSymbolInstance(layer) {
    var className = layer.class() + '';
    return className == 'MSSymbolInstance';
}

/**
 * Utility to determine whether the specified layer is a master symbol.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isMasterSymbol(layer) {
    var className = layer.class() + '';
    return className == 'MSSymbolMaster';
}

/**
 * Utility to determine whether the specified layer is an artboard.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isArtboard(layer) {
    var className = layer.class() + '';
    return className == 'MSArtboardGroup';
}

/**
 * Utility to determine whether the specified layer is a group.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isGroup(layer) {
    var className = layer.class() + '';
    return className == 'MSGroupLayer' || className == 'MSArtboardGroup';
}

/**
 * Utility to determine whether the specified layer is a text layer.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isText(layer) {
    var className = layer.class() + '';
    return className == 'MSTextLayer';
}

/**
 * Utility to determine whether the specified layer is a group layer.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isImage(layer) {
    var className = layer.class() + '';
    return className == 'MSBitmapLayer';
}

/**
 * Utility to determine whether the specified layer is a shape layer.
 *
 * @param {MSLayer} layer
 * @returns {boolean}
 */
function isShape(layer) {
    var className = layer.class() + '';
    return className == 'MSShapeGroup';
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

// Code for debugging as Sketch script (vs installed plugin)
//var selectedLayers = context.selection;
//_updateButtonSymbols(selectedLayers);
