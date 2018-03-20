/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

@import "button-symbols.js";

/**
 * Not really used for now. I hope to use this in the future.
 *
 * @param context
 */
function onSelectionChanged(context) {
    clog('running onSelectionChanged()');
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
    clog('running onTextChanged()');
    // todo - once this method will actually run we can automate it to update the button symbol the text is part of.
    return;
    /*var action = context.actionContext;
     var doc = action.document;
     doc.showMessage('Text changed in document.');*/
}
