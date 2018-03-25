# Button-Symbols
Sketch plugin using symbol overrides to re-label, re-size, and re-position buttons. Supports nested symbols, complex button systems, icons and more!

## What can this plugin do for me?

* Use symbols for buttons.
    * Supports simple and complex button systems using various symbol replacement approaches.
	* Change the label (text override)
	* Change the horizontal and vertical padding (text overrides)
	* Change the offset position for the button (anchor to top, left, right, bottom, or center)

## What is New in 1.4.0 (replaces 1.3.0)

* Added a new command: Convert Selection to Button.
    * Covert your current selection into a valid symbol recognized by the Button Symbols plugin.
    * Shortcut: Ctrl + Cmd + Shift + B
    * Simplest usage pattern: Create a shape layer for your button background and run this command.
* Improved flexibility of symbol layer structure and naming.
    * Removed the requirement of having a layer named "Label" inside the symbol.
    * Removed the requirement of having a layer named "Background" inside the symbol.
    * Added support for a new special layer named "Label Placeholder" which was needed for the creation of some complex button systems.
* Added a Sketch file containing an advanced button system with a lot of flexibility for real world use.
    * Feel free to copy this as a starting point and customize for your own needs.
    * Learn how to <a href="https://github.com/mwhite05/Button-Symbols/blob/master/Advanced Button System.md">create your own advanced button system</a> from scratch.

## Install with Sketchpacks

<a href="https://sketchpacks.com/mwhite05/Button-Symbols/install">
  <img width="160" height="41" src="http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png" >
</a>

## Demo!

<p><img src="https://github.com/mwhite05/Button-Symbols/blob/master/Button Symbols 1.3.0 - Basic Demo-150.gif?raw=true" alt="Button Symbols 1.3.0 - Basic Demo"></p>

At the end of the gif I show how the position works relative to the group. The button itself is considered part of the group so if the button is outside the area you want to position inside of then you need to move the button within that area before running the plugin. Otherwise the button ends up being used to position itself which has some odd side effects.

## Usage / Instructions

The simplest way to get started with Button Symbols version 1.4.0+ is to:

* Create a rectangle for your button background.
* Create a text layer for your button label.
* Select both layers and run the "Convert Selection to Button" command (shortcut: ctrl cmd shift B)
* You now have a new symbol that is fully compatible with the Button Symbols command and an instance of that symbol is already selected.
* In the Inspector panel you will see the symbol overrides. Adjust values as desired.
* With the symbol instance layer still selected, use the `cmd + j` keyboard shortcut to resize and reposition the button. (Pro-Tip: Sketch doesn't see the updated override value until the field loses focus so be sure to tab away from the field before trying to use the shortcut!)

## Offset Container

The button position is calculated relative to its parent group. If it is not inside any group then the artboard is used. If the button is outside of all artboards then the page is used. The group|artboard|page that is used is referred to as the `Offset Container` for the remainder of this document.

## What do the Overrides Do?

* **Label (or first text layer):**
    * Change this to set a custom label for your button. This label should always be a single line of text.
    * A blank (empty) value tells the plugin to use the default label (from the master symbol).

* **Padding-H:**
    * Set this to a positive integer to use a custom amount of horizontal padding for your button.
    * The number you use will be added to the left **and** right so a value of `10` would be 10 pixels of left padding and 10 pixels of right padding.
    * Leave this value blank (empty) to have your button use the horizontal padding from the master symbol itself.
    * Use a value of `custom` to manually set the width of your button.

* **Padding-V:**
    * Set this to a positive integer to use a custom amount of vertical padding for your button.
    * The number you use will be added to the top **and** bottom so a value of `10` would be 10 pixels of top padding and 10 pixels of bottom padding.
    * Leave this value blank to use the vertical padding from the master symbol itself.
    * Use a value of `custom` to manually set the height of your button.

* **Position-X:**
    * Set this to a positive number to position the button relative to the left edge of its offset container.
    * Use a negative number to position relative to the right edge of the offset container.
    * Use a value of `center` to horizontally center the button within its offset container.
    * Leave blank to manually position the button horizontally.
    * Any label width changes made when Position-X is blank will anchor the resize from the horizontal center.
    * Use a value of `left` or `right` to position the left or right edge of the button flush with offset container's left or right edge.
    * Use a comma separated pair of integers to create a "stretchy" button. For example: `20,20` will set the button to full width with 20 pixels margin left and 20 pixels margin right. 

* **Position-Y:**
    * Set this to a positive number to position the button relative to the top edge of its offset container.
    * Use a negative number to position relative to the bottom edge of the offset container.
    * Use a value of `center` to vertically center the button within its offset container.
    * Leave blank to manually position the button vertically.
    * Any label width changes made when Position-Y is blank will anchor the resize from the vertical center.
    * Use a value of `top` or `bottom` to position the top or bottom edge of the button flush with offset container's top or bottom edge.
    * Use a comma separated pair of integers to create a "stretchy" button. For example: `20,20` will set the button to full height with 20 pixels margin top and 20 pixels margin bottom.

## Future Plans

* Handling of events/Actions: The TextChanged event is only run when the text layer value is changed directly and does not run when a symbol override changes. I'm currently looking into alternative solutions that will work via the Cocoascript API. At this time I have no plans to rewrite this plugin in native code.
* [Use the issue reports page to request features](https://github.com/mwhite05/Button-Symbols/issues). No promises that I will add them, but feel free to ask.

