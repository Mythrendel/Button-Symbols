/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

@import "mwhite.base-class.js";
@import "mwhite.util.js";

//noinspection JSValidateJSDoc
var ButtonSymbols = Mwhite.BaseClass.extend({
    context: null,
    document: null,
    page: null,
    selection: null,
    util: null,
    sketch: null,
    /**
     *
     * @param {__NSDictionaryM} context
     * @private
     */
    __construct: function(context) {
        this.util = Mwhite.Util;
        this.context = context;
        this.sketch = context.api();
        this.document = context.document;
        this.page = this.document.currentPage();
        this.selection = context.selection;
    },
    showMessage: function(message) {
        this.document.showMessage(message);
    },
    insertButtonSymbolForSelection: function() {
        var layers = this.selection;

        if(!layers.count()) {
            this.showMessage('Please select a layer or artboard before inserting a button.');
            return;
        }

        for(var k = 0; k < layers.count(); k++) {
            var layer = layers[k];

            var group = null;
            /*if(this.isText(layer)) {
                // The idea here is to get the text layer's value and then replace the text layer with a button instance that contains the text layer's value as its label override.
                /!*
                 *
                 * var obj = {};
                 obj[<overrideLayerID>] = "overrideText";
                 symbolInstance.addOverrides_forCellAtIndex_ancestorIDs_(obj, 0, nil);
                 *!/
            } else {*/

            if(this.isGroup(layer)) {
                group = layer;
            } else {
                group = layer.parentGroup();
            }

            // Insert the symbol into the target group.
            var symbolUri = this.sketch.resourceNamed('Symbol.sketch');


            var sketchFile = MSDocument.new();
            sketchFile.readFromURL_ofType_error(symbolUri, 'com.bohemiancoding.sketch.drawing', null);

            if(sketchFile) {
                this._addSymbolByName(sketchFile, group, 'ButtonSymbols/Sample');
                sketchFile.close();
            } else {
                this.showMessage('Unable to open the Symbol.sketch file in the plugin Resources folder. Try re-installing Button Symbols to repair the plugin.');
            }
            //}
        }
    },
    /**
     * Update the size and position of any selected button symbols.
     *
     * @returns {void}
     */
    updateSelectedButtons: function() {
        var layers = this.selection;

        // todo filter the selection to a list of layers that match the required layer configuration.

        if(!layers.count()) {
            this.showMessage('Please select at least one button layer to update.');
            return;
        }

        for(var k = 0; k < layers.count(); k++) {
            var layer = layers[k];

            // Check to see if the layer is a Symbol (this operation only works for symbols)
            var symbol = this.getSymbolForLayer(layer);
            if(symbol) {
                var symbolMaster = symbol.symbolMaster();
                var masterChildren = symbolMaster.children();
                var masterChildrenCount = masterChildren.count();

                var overrides = layer.overrides();

                clog('better overrides', overrides + '');

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

                            // We now support the Label layer as a symbol so that its color can change independently of the other button parts.
                            if(this.isSymbol(childLayer)) {
                                // Dig down to find the actual text layer for the label text.
                                var labelMaster = childLayer.symbolMaster();
                                var labelChildren = labelMaster.children();
                                var masterLabelTextLayer = this.getLayerByName('Label', labelChildren);
                                var masterLabelTextLayerId = masterLabelTextLayer.objectID() + '';
                                var masterLabelTextLayerName = masterLabelTextLayer.name(); // Currently will always be: Label

                                clog('masterLabelTextLayerId', masterLabelTextLayerId);

                                var labelLayerOverrides = overrides[childObjectId];

                                clog('labelLayerOverrides', labelLayerOverrides + '');

                                if(labelLayerOverrides[masterLabelTextLayerId]) {
                                    clog("ROUTE A");
                                    // This is the easy way; they haven't swapped symbols for the label so the ID still matches.
                                    labelTextOverride = labelLayerOverrides[masterLabelTextLayerId];
                                    clog('labelTextOverride', labelTextOverride + '');
                                    labelLayer = masterLabelTextLayer;
                                } else {
                                    clog("ROUTE B");
                                    // loop over the label symbol layer's overrides
                                    // Find each corresponding layer by ID var layer = this._object.documentData().layerWithID_(layer_id);
                                    // Get the name of that corresponding layer and see if it matches the masterLabelTextLayerName
                                    // This is essentially how Sketch itself figures out if your overrides should be
                                    // mapped to the new symbol so it seems safe enough to do this in our plugin.
                                    for(var tmpLayerId in labelLayerOverrides) {
                                        //noinspection JSUnfilteredForInLoop
                                        var tmpLayer = this.document.documentData().layerWithID_(tmpLayerId);
                                        if(tmpLayer) {
                                            var tmpLayerName = tmpLayer.name();
                                            if(tmpLayerName == masterLabelTextLayerName) {
                                                //noinspection JSUnfilteredForInLoop
                                                labelTextOverride = labelLayerOverrides[tmpLayerId];
                                                labelLayer = tmpLayer;

                                                // We found the label text override so we're done with the loop.
                                                break;
                                            }
                                        }
                                    }

                                }
                            } else {
                                clog("ROUTE C");
                                labelLayer = childLayer;
                                labelTextOverride = overrides[childObjectId];
                            }
                            break;
                        case 'Position-X':
                            if(overrides[childObjectId]) {
                                positionX = overrides[childObjectId];
                            }
                            if(!positionX) {
                                if(this.isText(childLayer)) {
                                    positionX = childLayer.stringValue();
                                }
                            }
                            break;
                        case 'Position-Y':
                            if(overrides[childObjectId]) {
                                positionY = overrides[childObjectId];
                            }
                            if(!positionY) {
                                if(this.isText(childLayer)) {
                                    positionY = childLayer.stringValue();
                                }
                            }
                            break;
                        case 'Padding-H':
                            if(overrides[childObjectId]) {
                                paddingH = overrides[childObjectId];
                            }
                            if(!paddingH) {
                                if(this.isText(childLayer)) {
                                    paddingH = childLayer.stringValue();
                                }
                            }
                            break;
                        case 'Padding-V':
                            if(overrides[childObjectId]) {
                                paddingV = overrides[childObjectId];
                            }
                            if(!paddingV) {
                                if(this.isText(childLayer)) {
                                    paddingV = childLayer.stringValue();
                                }
                            }
                            break;
                        case 'Background':
                            templateBackgroundWidth = childLayer.frame().width();
                            templateBackgroundHeight = childLayer.frame().height();
                            break;
                        default:
                            // Nothing to do here
                    }
                }

                // Use the master symbol's label text if no override is set.
                var defaultSymbolTextLayerValue = ' ';
                // If labelLayer is not found it might be because it is nested inside a symbol that was overridden to "None"
                if(labelLayer) {
                    defaultSymbolTextLayerValue = labelLayer.stringValue();
                }
                var emptyLabel = false;
                if(labelTextOverride.match(/[\s]+/)) {
                    // Label override is just one or more spaces; treat it as an empty label.
                    emptyLabel = true;
                } else if(labelTextOverride == '' || labelTextOverride == null) {
                    // Label override is not set at all so use the default.
                    labelTextOverride = defaultSymbolTextLayerValue;
                }

                if(paddingH != 'custom') {
                    paddingH = parseInt(paddingH, 10);
                    if(!paddingH) {
                        // No default or override horizontal padding. Calculate it from existing dimensions in the master symbol.
                        paddingH = (templateBackgroundWidth - templateLabelWidth) / 2;
                    }
                }

                if(paddingV != 'custom') {
                    paddingV = parseInt(paddingV, 10);
                    if(!paddingV) {
                        // No default or override vertical padding. Calculate it from existing dimensions in the master symbol.
                        paddingV = (templateBackgroundHeight - templateLabelHeight) / 2;
                    }
                }

                // If no existing x or y position is set, treat the center position of this symbol as the anchor point for the resize
                var maintainCenterH = false;
                var maintainCenterV = false;
                var centerToParentH = false;
                var centerToParentV = false;
                positionX = positionX.toString().trim();
                positionY = positionY.toString().trim();
                var positionLeft = false;
                var positionRight = false;
                var positionTop = false;
                var positionBottom = false;
                var stretchyV = false;
                var stretchyH = false;
                var matches = null;
                switch(positionX) {
                    case 'center':
                        centerToParentH = true;
                        break;
                    case 'left':
                    case 'right':
                        break;
                    default:
                        matches = positionX.match(/(-?[\d]+)(,[\s]{0,}(-?[\d]+))?/);
                        if(matches) {
                            if(typeof(matches[3]) != 'undefined') {
                                // Got a paired set of values
                                stretchyH = true;
                                positionLeft = parseInt(matches[1], 10);
                                positionRight = parseInt(matches[3], 10);
                            } else {
                                positionX = parseInt(matches[1], 10);
                                if(!positionX) {
                                    maintainCenterH = true;
                                }
                            }
                        } else {
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
                        matches = positionY.match(/(-?[\d]+)(,[\s]{0,}(-?[\d]+))?/);
                        if(matches) {
                            if(typeof(matches[3]) != 'undefined') {
                                // Got a paired set of values
                                stretchyV = true;
                                positionTop = parseInt(matches[1], 10);
                                positionBottom = parseInt(matches[3], 10);
                            } else {
                                positionY = parseInt(matches[1], 10);
                                if(!positionY) {
                                    maintainCenterV = true;
                                }
                            }
                        } else {
                            maintainCenterV = true;
                        }
                        break;
                }

                var currentSymbolWidth = symbol.frame().width();
                var currentSymbolHeight = symbol.frame().height();

                var currentSymbolX = symbol.frame().x();
                var currentSymbolY = symbol.frame().y();

                var skipWidthAdjustment = false;
                var skipHeightAdjustment = false;

                /*if(emptyLabel === true) {
                    skipWidthAdjustment = true;
                    skipHeightAdjustment = true;
                } else {*/
                    if(paddingH == 'custom') {
                        // Adjust padding size so we can safely do math with it.
                        paddingH = 0;
                        skipWidthAdjustment = true;
                    }
                    if(paddingV == 'custom') {
                        // Adjust padding size so we can safely do math with it.
                        paddingV = 0;
                        skipHeightAdjustment = true;
                    }
                //}

                // Get the container for this symbol
                var group = symbol.parentGroup();
                var groupWidth = group.frame().width();
                var groupHeight = group.frame().height();

                if(!labelLayer) {
                    labelWidth = 0;
                    labelHeight = 0;
                    skipWidthAdjustment = true;
                    skipHeightAdjustment = true;
                } else {
                    // Set the master symbol's label text to the value of the override text
                    labelLayer.setStringValue(labelTextOverride);

                    // Get the updated width and height of the label text
                    var labelWidth = labelLayer.frame().width();
                    var labelHeight = labelLayer.frame().height();

                    // Restore the master symbol's label text to its initial value
                    labelLayer.setStringValue(defaultSymbolTextLayerValue);
                }

                var newSymbolWidth = labelWidth + (paddingH * 2);
                var newSymbolHeight = labelHeight + (paddingV * 2);

                // Are we setting the width based on a stretchy setting? (pin to left and right)
                if(stretchyH) {
                    // Subtract the padding offset values to get the new button symbol width/
                    newSymbolWidth = groupWidth - (positionLeft + positionRight);
                    // Make sure the X position is just the left offset. The width of the button will automatically reach the correct location for the right position offset.
                    positionX = positionLeft;
                }

                // Are we setting the height based on a stretchy setting? (pin to top and bottom )
                if(stretchyV) {
                    // Subtract the padding offset values to get the new button symbol height.
                    newSymbolHeight = groupHeight - (positionTop + positionBottom);
                    // Make sure the Y position is just the top offset. The height of the button will automatically reach the correct location for the bottom position offset.
                    positionY = positionTop;
                }

                if(skipWidthAdjustment === true) {
                    // We need this set properly in the position calculations
                    newSymbolWidth = currentSymbolWidth;
                } else {
                    symbol.frame().setWidth(newSymbolWidth);
                }

                if(skipHeightAdjustment === true) {
                    // We need this set properly in the position calculations
                    newSymbolHeight = currentSymbolHeight;
                } else {
                    symbol.frame().setHeight(newSymbolHeight);
                }

                // Reposition the button within its container as required
                if(!group) {
                    return;
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
    },

    /**
     * Utility to determine whether the specified layer is a symbol of any kind (master or instance)
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isSymbol: function(layer) {
        var className = layer.class() + '';
        return className == 'MSSymbolMaster' || className == 'MSSymbolInstance';
    },

    /**
     * Utility to determine whether the specified layer is a symbol instance.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isSymbolInstance: function(layer) {
        var className = layer.class() + '';
        return className == 'MSSymbolInstance';
    },

    /**
     * Utility to determine whether the specified layer is a master symbol.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isMasterSymbol: function(layer) {
        var className = layer.class() + '';
        return className == 'MSSymbolMaster';
    },

    /**
     * Utility to determine whether the specified layer is an artboard.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isArtboard: function(layer) {
        var className = layer.class() + '';
        return className == 'MSArtboardGroup';
    },

    /**
     * Utility to determine whether the specified layer is a group.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isGroup: function(layer) {
        var className = layer.class() + '';
        return className == 'MSGroupLayer' || className == 'MSArtboardGroup';
    },

    /**
     * Utility to determine whether the specified layer is a text layer.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isText: function(layer) {
        var className = layer.class() + '';
        return className == 'MSTextLayer';
    },

    /**
     * Utility to determine whether the specified layer is a group layer.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isImage: function(layer) {
        var className = layer.class() + '';
        return className == 'MSBitmapLayer';
    },

    /**
     * Utility to determine whether the specified layer is a shape layer.
     *
     * @param {MSLayer} layer
     * @returns {boolean}
     */
    isShape: function(layer) {
        var className = layer.class() + '';
        return className == 'MSShapeGroup';
    },
    /**
     * Utility to get the symbol that the specified layer is part of. If the layer is not in a symbol null is returned.
     *
     * @param layer
     * @returns {*}
     */
    getSymbolForLayer: function(layer) {
        if(layer) {
            if(this.isSymbol(layer)) {
                return layer;
            }

            return this.getSymbolForLayer(layer.parentGroup());
        }

        return null;
    },
    /**
     * Get a symbol based on its name from a list of provided symbol layers.
     *
     * @param {String} targetLayerName The expected name of a layer.
     * @param {NSArray} layers A list of layers (of any layer type) to look through for a layer with the provided name.
     * @return {MSSymbolMaster|null}
     */
    getLayerByName: function(targetLayerName, layers) {
        for(var i = 0; i < layers.count(); i++) {
            var layerName = layers.objectAtIndex(i).name();
            if(layerName && layerName.isEqualToString(targetLayerName)) {
                return layers.objectAtIndex(i);
            }
        }

        return null;
    },
    /**
     * Creates the Symbols page in the current Sketch document if necessary and then returns a reference to it.
     *
     * @returns {*}
     */
    getSymbolsPage: function() {
        var symbolsPage = this.document.documentData().symbolsPageOrCreateIfNecessary();
        return symbolsPage;
    },
    _addSymbolByName: function(sourceDocument, targetGroup, symbolName) {
        var sourceSymbols = sourceDocument.documentData().allSymbols();
        var sourceSymbol = this.getLayerByName(symbolName, sourceSymbols);

        if(sourceSymbol) {
            var symbolsPage = this.getSymbolsPage();
            var sourceSymbolName = sourceSymbol.name() + '';
            // Check that the symbol by the same name doesn't already exist
            var allSymbols = symbolsPage.documentData().allSymbols();
            var tmpSourceSymbol = this.getLayerByName(sourceSymbolName, allSymbols);
            if(!tmpSourceSymbol) {
                symbolsPage.addLayers([sourceSymbol]);
                allSymbols = this.document.documentData().allSymbols();
                sourceSymbol = this.getLayerByName(sourceSymbolName, allSymbols);
            } else {
                sourceSymbol = tmpSourceSymbol;
            }
            // Add symbol instance to the target group
            var symbolInstance = sourceSymbol.newSymbolInstance();
            // todo change how X,Y coordinates are determined.
            targetGroup.addLayers([symbolInstance]);
        }
    }
});
