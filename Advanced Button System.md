# Advanced Button System

Having a button plugin is great but what good is it without a supplement of symbols that work together as a powerful unit for creating buttons used in real world systems.

Here I have compiled information about how the pieces of the Advanced Button System come together and really shine when combined with the Button Symbols plugin.

**NOTE:** You can use the advanced button system sketch symbols in the sketch file as-is with no modifications. However, you most likely want to customize the look and feel of the buttons to your own needs. To customize this system effectively it is important to understand the fundamental concepts that went into creating it as well as the limitations that shaped some of the decisions I made along the way.

## What is a button system?

Button system is the term I use to describe the use of symbols (and the Button Symbols plugin) to make dropping buttons into a design easy. Even with just a background layer and label the options for changing colors quickly becomes unruly if not managed well via a systematic approach.


## What makes this button system advanced?

The fact that so many variants are supported via symbol overrides is why I consider this an advanced button system. You might find it rather simplistic in some regards, but the underlying concept could be built upon even further to create even more options based on your own needs. The specifics of those are up to you and well beyond the purview of this plugin and supporting materials.

## Understanding Symbol Overrides

When you have a symbol that contains a text layer, instances of that symbol allow you to override the layer's text content. If you are not familiar with this, create a text layer, convert it to a symbol, add an instance of that symbol to your document, select the instance and look in the properties inspector (right sidebar). You will see a text input field with a label above it named the same as your text layer's name.

Additionally Sketch supports nested symbols which show as overridable. The overrides for symbols nested inside symbols nested inside symbols, and so on all show up as part of the symbol instance's properties. This is HUGE and I do cover how this all works later on in this document.

**CRITICAL:** You _must_ understand that symbol level overrides show only the other symbols that share the _exact same dimensions_ as the base symbol used. That means if the artboard for your alternate symbol  is even a single pixel different in either height or width, Sketch will _not_ show your alternate as an override choice!

## Naming Your Layers

In a system like this one, it is absolutely crucial to work out some sort of naming convention that you like and then STICK TO IT. You'll thank yourself for it later.

**TIP:** Using forward slashes ( / ) in your symbol names creates sub-groupings within the symbols list! (This trick also works for creating sub-directories when you export layers.)

## The Overview

To create the button system we're going to create a couple of types of building block symbols that are later used to create the final button setup.

- Color Swatch Symbols
- Icon Symbols

You can create as many or as few of each symbol type as you think you need. I'll be using just a few color swatches for this example system.

As for icons, I'll just set up a couple for this example system but you'll probably end up with many icon symbols for your own use.

Once the swatches and icons are set up as symbols (see below) we'll venture into setting up four basic button variants, and then creating an "inverse" color variant of each one. This progression will allow starting with the basics and gradually getting more complex as we put together each new piece.

## Creating Color Swatches

This part is easy, choose an artboard size for all of your color swatches to use. Swatches don't have to be square but in my opinion they make better swatch symbol previews in the symbols lists if they are square.

- Create an artboard of the size you chose (I chose 101 x 101)
- Create a rectangle shape in your new artboard
- Remove any border from the shape
- Set the desired fill color for the shape
- Make the shape fill the entire swatch so it has no gaps around the edges.
- Name the shape layer as something like "Swatch/Blue"
- Convert the shape layer to a symbol (keeping the name you just set).

Repeat this process for each swatch you need. (You can always add more later and they just automatically show up in the overrides list.)

## Creating Icons

This step is a little trickier and is our first use of a nested symbol. We'll also be using a layer masking technique to allow changing the color of the icon per instance of the icon symbol.

Again, choose a size for your icon symbols. I **highly** recommend using the size that is most commonly used throughout your application. You can always resize the icon symbol instances as needed. We use a lot of 24 x 24 icons so that's what I've used in the sample sketch file. Try using a size for these that is not shared by other types of symbols you'll be creating in order to keep your symbol override lists clean and organized.

- Create an artboard of the size you chose (e.g. 24 x 24)
- Unless you have specific reasons not to, create a transparent rectangle and set it to completely fill the artboard. This will act as a size holder for your icon if your icon shape's dimensions aren't perfectly square.
- Create or paste in your icon shape layer or group.
- Size the icon as desired. In my experience it works best to set the largest dimension to touch the artboard edges and center the icon vertically and horizontally within the arboard. Your needs may vary.
- The icon shape's color doesn't actually matter. (see next step)
- Insert an instance of a color swatch symbol (e.g. Swatch/Blue) _above_ the icon shape layer.
- Resize the swatch symbol so that it _completely fills_ the artboard
- Your icon should _not_ be visible at this time.
- Right click on the icon shape layer and choose "Mask" from the context menu that appears (it's near the bottom).
- Your icon shape should now be visible and perfectly filled with the color of the swatch symbol you selected. Yay!
- Group all of the layers in the icon's artboard.
- Name the group something like "Icon/Circle".
- Convert the group to a symbol (keeping the name you just set).

Repeat this process for each icon you need. (You can always add more later and they just automatically show up in the overrides list.)

**TIP:** If you don't center your icon, when you resize the layer you'll probably get undesired results.

## Creating a Button Symbol

Before we get started, consider how the Button Symbols plugin works. It uses the master symbol as a template for how to resize your button based on the label's size after you set a label text override. Because of this, we want to set our button system up to have the correct distance from the label to each edge of our button.

For example, if you wanted 20 pixels of padding on the left and right and 10 pixels of padding on the top and bottom then you'd set up your default label text value (e.g. "Label"), calculate the width and height, then add 40 (20 * 2) pixels to the width and 20 (10 * 2) pixels to the height to calculate your button's overall size.

The easiest button to set up is the one that has a label and does _not_ have any icons.

- Create an artboard (any size for now)
- Add a text layer named "Label" (the plugin needs the label layer to be named "Label")
- Set the value of the text layer to something like "Button Label"
- Calculate the width and height of the text layer and decide how much padding you want on each side.
- Set the artboard size to the desired button size to get the desired padding around the label text.
- Set the text label to center the text.
- Center the label layer on the artboard.
- If you want a background color for your button insert a swatch symbol of the desired color and set it to fill the artboard.
- Group the layers and name the group something like "Button/Solid/Label Only"
- Convert the group to a symbol by selecting it and using the Button Symbols > Convert Selection to Button option.


## Creating a Button with an Icon

For this example we'll create a button with the icon placed to the left side of the label.

To make this work you need to understand how to set the resize attachment behavior of layers using the built-in Sketch options for pin [top, right, bottom, left], fixed width, and fixed height.

- Duplicate the symbol button symbol you created that has only a label.
- Rename it to something like "Button/Solid/Icon Left"
- Resize the artboard to make room for an icon to the left of the button.
- Insert one of the icon symbols you created earlier and position it where you want.
- With the icon symbol layer selected, enable the "Pin Left", "Fixed Width", and "Fixed Height" options.
- Now select the Label layer
- CRITICAL: ensure "Auto" (not "Fixed) is selected (near the text alignment options)
	- Sometimes Sketch is greedy and sets this to "Fixed" on its own after you make changes. If all your button instances suddenly stop working properly remember to check this!
- Set the text alignment to left aligned.
- Enable the "Pin Left" and "Fixed Width" options for the Label Layer.
- You duplicated a symbol to start; there is no convert to symbol step for this one.


## Creating a Button without a Label

Sometimes you might need a button that does not even have a text label; an icon-only button for example.

This is where we make use of the Label Placeholder functionality added in Button Symbols 1.4.0

- Duplicate the previous button symbol you made with an icon and a label in it.
- Delete the "Label" text layer.
- Deselect the "Pin Left" and "Pin Top" options for the icon layer.
- Center the icon vertically and horizontally inside the artboard.
- Insert a rectangle layer and name it "Label Placeholder".
	- Set the height of the rectangle to match the icon height.
	- Set the width of the rectangle to match the icon width.
- Center the "Label Placeholder" rectangle vertically and horizontally inside the artboard.
- You duplicated a symbol to start; there is no convert to symbol step for this one.


## Creating a Button with a Border and Customizable Text Color


NOTE: The changing text color only works with a white background due to the use of the Screen blending mode. (Sketch 49 does not support true masking text layers as it does with shape layers but the screen mode on white gives the same effect.)

- Duplicate the first button symbol you made that contained only a label.
- If there is not already a background color layer, insert a color swatch symbol of your choice.
- Name/rename the color swatch layer to "Border Color" and ensure it fills the artboard completely.
- Add a white rectangle layer (above the "Border Color" layer) and ensure it fills the artboard completely.
	- Reduce the width AND height of the white rectangle layer by <borderSize> * 2. (If your borderSize = 2px then reduce layer width and height by 2 * 2 = 4px)
	- Set the X and Y offsets for the white rectangle to <borderSize>.
	- You should now be able to see the "Border Color" layer showing around all the edges of the white rectangle layer.
- Set the color for the "Label" text layer to solid black.
- Add another color swatch layer (above the "Label" text layer). Name it "Label Color" and ensure it fills the entire artboard.
	- You should now see a solid color for the entire artboard.
	- Set the "Blending" mode for this layer to "Screen".
	- The solid color should disappear and the text label color should match the color of the "Label Color" swatch.







