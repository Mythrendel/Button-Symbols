# Changelog

## v1.3.0
**Date:** 2017-09-01

1. Added support for `custom` as a special padding value. This allows you to take advantage of the position and label override features while controlling the button's width and/or height manually.
2. Added support for "stretchy" buttons by allowing a comma separated list of offset values (e.g. Position-X: &lt;left&gt;,&lt;right&gt; or Position-Y: &lt;top&gt;,&lt;bottom&gt;) If
3. Code cleanup to divide it into multiple files for better organization and easier maintenance of this plugin.
4. Improved the bundled symbol in regards to distribution to the world by changing the font in the default button to use Verdana instead of Open Sans and adjusted the name of the bundled symbol to "ButtonSymbols/Primary" (instead of just "Button").
5. Updated the demo on the readme page.
6. Updated the documentation of the available features.

## v1.2.4-alpha.1
**Date:** 2017-08-30

1. Added a new Symbol.sketch file as a resource that the plugin can use to insert a properly configured button master symbol.
2. Added a demo gif to the readme page.
3. Improved readme by specifying what type of layer each special layer in the button symbol must be.
4. Syntax correction where variables were implicitly declared.
5. Added a new idea to the future plans section of the readme.

## v1.2.3
**Date:** 2017-08-29

1. Much headdeskery. Patched an issue where the install link did not actually point to this plugin.

## v1.2.2
**Date:** 2017-08-29

1. Updated the readme to better outline this plugin when viewed in the Sketchpacks installer (only the first sentence of the readme file shows up there).
2. Added the Install with Sketchpacks badge to the readme file. 

## v1.2.1
**Date:** 2017-08-29

1. Added support for Sketchpacks in the manifest.json configuration file.

## v1.2.0
**Date:** 2017-08-28

1. Updated the plugin for Sketch 44.0+ by patching an issue where the layer overrides are no longer returned as an object wrapped by an array. They are now returned as just the object itself.

## v1.1.1
**Date:** 2017-04-22

Patch release.
 
1. Fixed an issue where the Position-X value when set to 'center' would cause it to behave as if the Position-Y value were also set to 'center'.

## v1.1.0
**Date:** 2017-04-21

Updated release to support some additional word based position options. Until this release it was not possible to have a button automatically position flush with the edges of the parent container.

1. Use `left` or `right` for `Position-X` to make button flush to left or right edge.
2. Use `top` or `bottom` for `Position-Y` to make button flush to top or bottom edge.

## v1.0.0
**Date:** 2017-04-18

Initial release of functional plugin capable of sizing and positioning a button using a symbol instance.

1. Use a symbol as a button.
2. Use special layer names in the button symbol to allow setting overrides for:
    * Label
    * Padding-H
    * Padding-V
    * Position-X
    * Position-Y
3. Keyboard shortcut `cmd + j` to run resize/reposition command on selected layers.
4. Use `center` for position values to center the button.
5. Positioning works to parent container (i.e. group, artboard).

