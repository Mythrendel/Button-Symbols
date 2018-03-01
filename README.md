# Button-Symbols
Sketch plugin using symbol overrides to re-label, re-size, and re-position buttons. Supports nested symbols, complex button systems, icons and more!

## What can this plugin do for me?

* Use symbols for buttons.
    * Supports simple and complex button systems using various symbol replacement approaches.
	* Change the label (text override)
	* Change the horizontal and vertical padding (text overrides)
	* Change the offset position for the button (anchor to top, left, right, bottom, or center)

## What's New in 1.3.0 (replaces 1.2.3)

1. Added support for `custom` as a special padding value. This allows you to take advantage of the position and label override features while controlling the button's width and/or height manually.
2. Added support for "stretchy" buttons by allowing a comma separated list of offset values (e.g. Position-X: &lt;left&gt;,&lt;right&gt; or Position-Y: &lt;top&gt;,&lt;bottom&gt;) If you set a stretchy setting, any padding along that axis will be ignored.
3. Code cleanup to divide it into multiple files for better organization and easier maintenance of this plugin.
4. Improved the bundled symbol in regards to distribution to the world by changing the font in the default button to use Verdana instead of Open Sans and adjusted the name of the bundled symbol to "ButtonSymbols/Primary" (instead of just "Button").
5. Updated the demo on the readme page.
6. Updated the documentation of the available features.

## Install with Sketchpacks

<a href="https://sketchpacks.com/mwhite05/Button-Symbols/install">
  <img width="160" height="41" src="http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png" >
</a>

## Demo!

<p><img src="https://github.com/mwhite05/Button-Symbols/blob/master/Button Symbols 1.3.0 - Basic Demo-150.gif?raw=true" alt="Button Symbols 1.3.0 - Basic Demo"></p>

At the end of the gif I show how the position works relative to the group. At this time, the button itself is considered part of the group so if the button is outside the area you want to position inside of then you need to move the button within that area before running the plugin. Otherwise the button ends up being used to position itself which has some odd side effects.

## Use Symbol Swapping to Avoid Nested Button Symbols

<p><img src="https://github.com/mwhite05/Button-Symbols/blob/master/Symbol Swapping Demo.gif?raw=true" alt="Symbol Swapping Demo"></p>

## Usage / Instructions

Getting started with the built-in sample button is probably the easiest way to check out how this plugin works. Just select an artboard, group, or layer and run the `Button Symbols > Insert Sample Button` command.

You will then have a new master symbol named ButtonSymbols/Primary in your Symbols page and a new instance of that symbol will be automatically placed.

That sample button contains the following layers.

* Label (text layer)
* Background (shape layer)
* Padding-H (text layer)
* Padding-V (text layer)
* Position-X (text layer)
* Position-Y (text layer)

(Don't worry - you can customize the buttons by adding other layers to your button too! For example, an icon symbol layer or a color symbol layer with a mask layer.)

1. Select the instance of that button symbol.
2. In the Inspector panel you will see the symbol overrides. All of the layers except for `Background` will appear in the list. Adjust values as desired.
3. With the layer still selected, use the `cmd + j` keyboard shortcut to resize and reposition the button. (Pro-Tip: Sketch doesn't see the updated override value until the field loses focus so be sure to tab away from the field before trying to use the shortcut!)

## Offset Container

The button position is calculated relative to its parent group. If it is not inside any group then the artboard is used. If the button is outside of all artboards then the page is used. The group|artboard|page that is used is referred to as the `Offset Container` for the remainder of this document.

## What do the Overrides Do?

* **Label:**
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

* In Sketch 47 beta they have announced support for a new feature called Libraries which is basically referencing other Sketch files with symbols in them. Pondering how to potentially leverage this functionality in this plugin. Ideas welcome, just post an issue report as a feature request.
* Handling of events/Actions: Currently I was unable to get the TextChanged and many other events (Actions) to trigger my code. Only a couple of the ones I tried worked so until that is patched you will need to run the plugin manually. As far as I can tell, once that works in Sketch I will be able to update this plugin to automatically respond as you change values. (I and others have contacted Bohemian about ths issue; see links below.)
* [Use the issue reports page to request features](https://github.com/mwhite05/Button-Symbols/issues). No promises that I will add them, but feel free to ask.

## Sketch Issues Causing Problems for the Growth of this Plugin

* [Using the Action API](http://sketchplugins.com/d/70-using-the-action-api/17)
* [Action API - Many/Most Actions Not Triggering](http://sketchplugins.com/d/190-action-api-many-most-actions-not-triggering)
* [Detecting changes to layers and styles](http://sketchplugins.com/d/185-detecting-changes-to-layers-and-styles)
