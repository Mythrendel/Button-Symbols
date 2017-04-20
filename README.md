# Button-Symbols
A plugin to make buttons easier to customize in Sketch (for Sketch 43.1+)

## What can this plugin do for me?

* Use symbols for buttons
	* Change the label (using symbol override)
	* Change the horizontal and vertical padding (does not use weird layer names for this!)
	* Change the relative position for the button (anchor to top, left, right, bottom, center)

## Usage / Instructions

Copy the button symbol from the provided Sketch file or create a symbol that contains the following layers (named exactly these things and preferably in this order):

* Label
* Background
* Padding-H
* Padding-V
* Position-X
* Position-Y

1. Insert an instance of the button symbol somewhere in your document.
2. Select the instance of that button symbol.
3. In the Inspector panel you will see the symbol overrides. All of the layers except for `Background` will appear in the list. Adjust values as desired.
4. With the layer still selected, use the `cmd + j` keyboard shortcut to resize and reposition the button.

## Offset Container

The button position is calculated relative to its parent group. If it is not inside any group then the artboard is used. If the button is outside of all artboards then the page is used. The group|artboard|page that is used is referred to as the `Offset Container` for the remainder of this document.

## What do the Overrides Do?

* **Label:** Change this to set a custom label for your button. This label should always be a single line of text in this version of the plugin.

* **Padding-H:** Set this to a positive number to use a custom amount of horizontal padding for your button. The number you use will be doubled so 10 would be 10 on the left and 10 on the right. Leave this value blank to use the horizontal padding from the master symbol itself.

* **Padding-V:** Set this to a positive number to use a custom amount of vertical padding for your button. The number you use will be doubled so 10 would be 10 on the top and 10 on the bottom. Leave this value blank to use the vertical padding from the master symbol itself.

* **Position-X:** Set this to a positive number to position the button relative to the left edge of its offset container. Use a negative number to position relative to the right edge of the offset container. Set to the word `center` to horizontally center the button within its offset container. Leave blank to manually position the button. Any label width changes made when Position-X is blank will anchor the resize from the horizontal center.

* **Position-Y:** Set this to a positive number to position the button relative to the top edge of its offset container. Use a negative number to position relative to the bottom edge of the offset container. Set to the word `center` to vertically center the button within its offset container. Leave blank to manually position the button. Any label height changes made when Position-Y is blank will anchor the resize from the vertical center.

## Future Plans

* Have an action to insert a button that conforms to the specifications this plugin requires.
* Handling of events/Actions: Currently I was unable to get the TextChanged and many other events (Actions) to trigger my code. Only a couple of the ones I tried worked so until that is patched you will need to run the plugin manually. As far as I can tell, once that works in Sketch I will be able to update this plugin to automatically respond as you change values. (I have contacted Bohemian about ths issue.)
* Icons in the button.
* Multi-line buttons (very very very low priority and maybe never - why is your button text so long or your button so small?!?!?! Maybe time to rethink your UX on that)
