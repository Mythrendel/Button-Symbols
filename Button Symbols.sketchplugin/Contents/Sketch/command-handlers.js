/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

@import "button-symbols.js";

//noinspection JSValidateJSDoc
/**
 * This is the method called when the user runs the plugin from the menu or keyboard shortcut.
 *
 * @param {__NSDictionaryM} context
 */
function command_updateSelectedButtons(context) {
    var bs = new ButtonSymbols(context);
    bs.updateSelectedButtons();
}

/**
 * This is the method called when the user runs the plugin from the menu or keyboard shortcut.
 *
 * @param context
 */
function command_insertButtonSymbolForSelection(context) {
    var bs = new ButtonSymbols(context);
    bs.insertButtonSymbolForSelection();
}
