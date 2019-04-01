/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

// @const sketch Instance of the full Sketch API (not the same as context.api() for some reason... sigh)
const sketch = require('sketch');

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
        //this.sketch = context.api();
        this.sketch = sketch; // Map sketch api reference to the value stored in the sketch constant; context.api() is not the same thing (anymore?)
        this.document = context.document;
        this.page = this.document.currentPage();
        this.selection = context.selection;
    },
    showMessage: function(message) {
        clog(message);
        this.document.showMessage(message);
    },

    initializeSelectionAsButton: function() {
        var layers = this.selection;
        var target = null;

        if(!layers.count()) {
            this.showMessage('Please select a layer, symbol, group, or artboard.');
            return;
        }

        var isSafeToGroup = true;
        for(var i=0; i < layers.count(); i++) {
            var layer = layers[i];
            if(this.isArtboard(layer) || this.isMasterSymbol(layer)) {
                isSafeToGroup = false;
                break;
            }
        }

        if(isSafeToGroup) {
            //var groupName = sketch.UI.getStringFromUser('Enter a name for the new button symbol: ', 'Button');
            var self = this;
            sketch.UI.getInputFromUser(
                'Enter a name for the new button symbol: ',
                {initialValue: 'Button'},
                function(error, groupName) {
                    if(error) {
                        return;
                    }

                    target = new sketch.Group({
                        parent: layers[0].parentGroup(),
                        name: groupName,
                        layers: layers
                    });
                    target.adjustToFit();
                    target = target._object;
                    self._convertTargetToSymbol(target);
                }
            );
        } else if(layers.count() === 1) {
            // Only one layer to deal with so we treat it as the group (even if it's an artboard or symbol master)
            target = layers[0];
            this._convertTargetToSymbol(target);
        } else {
            this.showMessage('Unable to process your selection.');
        }
    },

    _convertTargetToSymbol: function(target) {
        var buttonSource = this.getSymbolMasterForLayer(target);
        if(buttonSource) {
            this._initializeAsButtonSymbol(buttonSource);
        } else {
            if(this.isGroup(target) || this.isArtboard(target)) {
                buttonSource = target;
            } else {
                buttonSource = target.parentGroup();
            }
            if(buttonSource) {
                this._initializeAsButtonSymbol(buttonSource);
            } else {
                this.showMessage('Invalid selection: '+target.name());
            }
        }
    },

    /**
     *
     * @param target
     * @returns {MSLayerText|null}
     * @private
     */
    _getLabelLayer: function(target) {
        var labelLayer = this._getTextLayerByName('Label', target);
        // No valid "Label" layer found, is there any text layer we can use instead?
        if(!labelLayer) {
            var reservedNames = ['Padding-H', 'Padding-V', 'Position-X', 'Position-Y', 'Anchor'];
            var children = target.children();
            for(var i=0; i < children.length; i++) {
                var child = children[i];
                if(this.isText(child) && reservedNames.indexOf(child.name()+'') === -1) {
                    labelLayer = child;
                    break;
                }
            }
        }
        return labelLayer;
    },

    _initializeAsButtonSymbol: function(target) {
        // Add a Label text layer if no Label text layer or Label Placeholder shape layer exist
        var labelLayer = this._getLabelLayer(target);
        var labelLayerPlaceholder = this._getTextLayerByName('Label Placeholder', target);

        if(!labelLayer && !labelLayerPlaceholder) {
            var targetWidth = target.frame().width() / 2;
            var targetHeight = target.frame().height() / 2;

            var labelLayerStub = new sketch.Text({
                parent: target,
                text: "Label",
                alignment: sketch.Text.Alignment.center
            });

            labelLayer = labelLayerStub._object;

            labelLayer.fontSize = 16;
            labelLayer.setFontPostscriptName('Arial');
            var colorBlack = NSColor.colorWithDeviceRed_green_blue_alpha_(0, 0, 0, 1);
            labelLayer.changeTextColorTo(colorBlack);
            labelLayer.adjustFrameToFit();
            labelLayer.setTextBehaviour(0);
            labelLayer.hasFixedWidth = true;

            var labelWidth = labelLayer.frame().width();
            var labelHeight = labelLayer.frame().height();
            var x = targetWidth - (labelWidth / 2);
            var y = targetHeight - (labelHeight / 2);

            MSLayerMovement.moveToFront([labelLayer]);
            labelLayer.frame().setX(x);
            labelLayer.frame().setY(y);
        } else {
            /*// Ensure label layer is aligned center
            log('centering the text in the layer');
            log(labelLayer.style());
            log(sketch.Text.Alignment.center);
            labelLayer.style().alignment = sketch.Text.Alignment.center;*/
        }

        // Add the Padding-*, Position-* layers as required
        var colorBlackTransparent = NSColor.colorWithDeviceRed_green_blue_alpha_(0, 0, 0, 0);
        var layersNeeded = [
            'Padding-H',
            'Padding-V',
            'Position-X',
            'Position-Y'
        ];

        for(var i = 0; i < layersNeeded.length; i++) {
            if(!layersNeeded.hasOwnProperty(i)) {
                continue;
            }
            var layerName = layersNeeded[i];
            var textLayer = this._getTextLayerByName(layerName, target);
            if(!textLayer) {
                var textLayerStub = new sketch.Text({
                    parent: target,
                    text: '0',
                    alignment: sketch.Text.Alignment.left
                });

                textLayer = textLayerStub._object;

                //textLayer.replaceTextPreservingAttributeRanges('0');
                textLayer.setName(layerName);
                textLayer.fontSize = 6;
                textLayer.setFontPostscriptName('Arial');
                textLayer.changeTextColorTo(colorBlackTransparent);
                MSLayerMovement.moveToBack([textLayer]);
                textLayer.adjustFrameToFit();
                textLayer.frame().setX(targetWidth - (textLayer.frame().width() / 2));
                textLayer.frame().setY(targetHeight - (textLayer.frame().height() / 2));
            }
        }

        if((this.isArtboard(target) || this.isGroup(target)) && !this.isMasterSymbol(target)) {
            this._convertGroupingToSymbol(target);
        }
    },

    _convertGroupingToSymbol: function(grouping) {
        var layers = [];
        var children = grouping.children();
        for(var i=0; i < children.length; i++) {
            if(children.hasOwnProperty(i)) {
                var layer = children[i];
                if(layer.objectID() != grouping.objectID() && layer.parentGroup().objectID() == grouping.objectID()) {
                    layers.push(layer);
                }
            }
        }

        layers = MSLayerArray.arrayWithLayers(layers);
        var symbol = MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(layers, grouping.name(), true);

        // If selection was simple layer group, move the symbol instance to a sibling of the group and remove the original group
        if(this.isGroup(grouping)) {
            symbol.moveToLayer_beforeLayer(grouping.parentGroup(), grouping);
            grouping.removeFromParent();
        }
    },

    _getLayerById: function(id, layer) {
        if(!layer) {
            layer = this.page;
        }

        if(layer.objectID() + '' == id) {
            return layer;
        }

        // Loop children
        var children = layer.children();
        for(var k=0; k < children.count(); k++) {
            var child = children[k];
            if(child.objectID() + '' != layer.objectID() + '') {
                var target = this._getLayerById(id, child);
                if(target) {
                    return target;
                }
            }
        }

        return null;
    },

    /**
     *
     * @param name
     * @param layer
     * @returns {*} Returns null if no layer by the given name is found for the provi
     * @private
     */
    _getTextLayerByName: function(name, layer) {
        if(this.isText(layer) && layer.name() + '' == name) {
            return layer;
        } else if(this.isArtboard(layer) || this.isGroup(layer) || this.isMasterSymbol(layer)) {
            // Loop children
            var children = layer.children();
            for(var k=0; k < children.count(); k++) {
                var child = children[k];
                if(child.objectID() + '' != layer.objectID() + '') {
                    var target = this._getTextLayerByName(name, child);
                    if(target) {
                        return target;
                    }
                }
            }
        }

        return null;
    },

    /**
     * Update the size and position of any selected button symbols.
     *
     * @returns {void}
     */
    updateSelectedButtons: function() {
        var layers = this.selection;

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
                var hasLabelPlaceholder = false;
                var templateLabelWidth = 0;
                var templateLabelHeight = 0;
                var templateBackgroundWidth = 0;
                var templateBackgroundHeight = 0;
                var maintainOffsetX = false;
                var maintainOffsetY = false;

                // Get template background dimensions directly from the master symbol instead of from a specifically named layer in the symbol which is very restrictive.
                templateBackgroundWidth = symbolMaster.frame().width();
                templateBackgroundHeight = symbolMaster.frame().height();

                // Loop the children of the symbol to find the layers that provide the override values we want.
                for(var i = 0; i < masterChildrenCount; i++) {
                    var childLayer = masterChildren[i];
                    var childName = childLayer.name() + '';
                    var childObjectId = childLayer.objectID() + '';

                    switch(childName) {
                        case 'Label':
                            if(!this.isText(childLayer)) {
                                break;
                            }
                            if(!hasLabelPlaceholder) {
                                // Only set this if we have not found a label placeholder yet. Label placeholders override the label itself for obtaining width.
                                templateLabelWidth = childLayer.frame().width();
                                templateLabelHeight = childLayer.frame().height();
                            }
                            labelLayer = childLayer;
                            labelTextOverride = overrides[childObjectId];
                            break;
                        case 'Label Placeholder':
                            hasLabelPlaceholder = true;
                            templateLabelWidth = childLayer.frame().width();
                            templateLabelHeight = childLayer.frame().height();
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
                        case 'Anchor':
                            // If there is a text layer named "Anchor", use its value as an X,Y coordinate pair for the default anchoring mechanism for the button when it resizes. (Default is center)
                            var anchorPoint = null;
                            var anchorX = null;
                            var anchorY = null;
                            if(overrides[childObjectId]) {
                                anchorPoint = overrides[childObjectId];
                            }
                            if(!anchorPoint) {
                                if(this.isText(childLayer)) {
                                    anchorPoint = childLayer.stringValue();
                                }
                            }
                            matches = anchorPoint.match(/(-?[\da-z]+)(,[\s]{0,}(-?[\da-z]+))?/);
                            if(matches) {
                                if(typeof(matches[1]) != 'undefined') {
                                    anchorX = parseInt(matches[1], 10);
                                    if(!anchorX || isNaN(anchorX)) {
                                        anchorX = matches[1];
                                    }
                                    anchorY = parseInt(matches[3], 10);
                                    if(!anchorY || isNaN(anchorY)) {
                                        anchorY = matches[3];
                                    }
                                }
                            }
                            if(anchorX == 'default') {
                                maintainOffsetX = true;
                            }

                            if(anchorY == 'default') {
                                maintainOffsetY = true;
                            }
                            break;
                        /* This is the old way it was done in v1.3.x
                        This way was too restrictive with advanced button symbols.
                        case 'Background':
                            templateBackgroundWidth = childLayer.frame().width();
                            templateBackgroundHeight = childLayer.frame().height();
                            break;*/
                        default:
                            // Nothing to do here
                    }
                }

                if(!positionX) {
                    positionX = anchorX;
                }
                if(!positionY) {
                    positionY = anchorY;
                }

                // If we don't have a label placeholder and no layer was found named "Label", find the first text layer we can find and use that for the label instead.
                if(!hasLabelPlaceholder && !labelLayer) {
                    labelLayer = this._getLabelLayer(symbolMaster);
                    if(labelLayer) {
                        labelTextOverride = overrides[labelLayer.objectID() + ''];
                        templateLabelWidth = labelLayer.frame().width();
                        templateLabelHeight = labelLayer.frame().height();
                    }
                }

                // Use the master symbol's label text if no override is set.
                var emptyLabel = false;
                if(labelLayer) {
                    var defaultSymbolTextLayerValue = labelLayer.stringValue();
                    if(labelTextOverride == '' || labelTextOverride == null) {
                        // Label override is not set at all so use the default.
                        labelTextOverride = defaultSymbolTextLayerValue;
                    } else if(labelTextOverride.match(/[\s]+/)) {
                        // Label override is just one or more spaces; treat it as an empty label.
                        emptyLabel = true;
                    }
                } else {
                    emptyLabel = true;
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

                // Set the master symbol's label text to the value of the override text
                if(labelLayer) {
                    labelLayer.setStringValue(labelTextOverride);

                    // Get the updated width and height of the label text
                    var labelWidth = labelLayer.frame().width();
                    var labelHeight = labelLayer.frame().height();

                    // Restore the master symbol's label text to its initial value
                    labelLayer.setStringValue(defaultSymbolTextLayerValue);
                } else {
                    labelWidth = templateLabelWidth;
                    labelHeight = templateLabelHeight;
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

                if(maintainOffsetX) {
                    // Nothing to do here; let sketch behave normally
                    return;
                } else if(maintainCenterH) {
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

                if(maintainOffsetY) {
                    // Nothing to do here; let sketch behave normally
                    return;
                } else if(maintainCenterV) {
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
        return className == 'MSLayerGroup' || className == 'MSGroupLayer';
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
     * Utility to get the master symbol that the specified layer references. If the layer is not itself a symbol master, symbol instance, or contained by a symbol master, null is returned.
     *
     * @param layer
     * @returns {*}
     */
    getSymbolMasterForLayer: function(layer) {
        if(layer) {
            if(this.isMasterSymbol(layer)) {
                return layer;
            }

            return this.getSymbolMasterForLayer(layer.parentGroup());
        }

        return null;
    },
    /**
     * Utility to get the artboard that the specified layer is part of. If the layer is not itself or is not contained by an artboard, null is returned.
     *
     * @param layer
     * @returns {*}
     */
    getArtboardForLayer: function(layer) {
        if(layer) {
            if(this.isArtboard(layer)) {
                return layer;
            }

            return this.getArtboardForLayer(layer.parentGroup());
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
