# Button-Symbols
A plugin that uses symbols and symbol overrides to make buttons insanely easy to re-label, re-size, position relative to parent container, and more. Supported in Sketch 46.2+

## What can this plugin do for me?

* Use symbols for buttons
	* Change the label (using symbol override)
	* Change the horizontal and vertical padding (does not use weird layer names for this!)
	* Change the relative position for the button (anchor to top, left, right, bottom, center)
    * Change the symbol itself to do things like re-color or change font in all button instances at once.

## Install with Sketchpacks

<a href="https://sketchpacks.com/mwhite05/Button-Symbols/install">
  <img width="160" height="41" src="http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png" >
</a>

## Demo!

Note: The demo makes use of a Symbol.sketch file available via the <a href="https://github.com/mwhite05/Button-Symbols/releases/latest">download of the latest release</a>.

<p><img src="https://github.com/mwhite05/Button-Symbols/blob/master/Button Symbols Plugin Demo-175.gif?raw=true" alt="Button Symbols Plugin Demo"></p>

<p>The above gif is exported at 175% speed. To see a slower version <a href="https://github.com/mwhite05/Button-Symbols/blob/master/Button Symbols Plugin Demo.mp4?raw=true">view it here</a>.</p>

## Usage / Instructions

Copy the button symbol from the provided Sketch file or create a symbol that contains the following layers (named exactly these things and preferably in this order):

* Label (text layer)
* Background (shape layer)
* Padding-H (text layer)
* Padding-V (text layer)
* Position-X (text layer)
* Position-Y (text layer)

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

* **Position-X:** Set this to a positive number to position the button relative to the left edge of its offset container. Use a negative number to position relative to the right edge of the offset container. Set to the word `center` to horizontally center the button within its offset container. Leave blank to manually position the button. Any label width changes made when Position-X is blank will anchor the resize from the horizontal center. Set to the word `left` or `right` to position left or right edge of button flush with parent container's left or right edge.

* **Position-Y:** Set this to a positive number to position the button relative to the top edge of its offset container. Use a negative number to position relative to the bottom edge of the offset container. Set to the word `center` to vertically center the button within its offset container. Leave blank to manually position the button. Any label height changes made when Position-Y is blank will anchor the resize from the vertical center. Set to the word `top` or `bottom` to position top or bottom edge of button flush with parent container's top or bottom edge.

## Future Plans

* Have an action to insert a button that conforms to the specifications this plugin requires (the button you get from Symbol.sketch).
* Support different padding on top vs bottom and left vs right with a format like Padding-H: 10,20 or 10:20.
* Handling of events/Actions: Currently I was unable to get the TextChanged and many other events (Actions) to trigger my code. Only a couple of the ones I tried worked so until that is patched you will need to run the plugin manually. As far as I can tell, once that works in Sketch I will be able to update this plugin to automatically respond as you change values. (I have contacted Bohemian about ths issue.)
* Icons in the button.
* Multi-line buttons (very very very low priority and maybe never - why is your button text so long or your button so small?!?!?! Maybe time to rethink your UX on that)
