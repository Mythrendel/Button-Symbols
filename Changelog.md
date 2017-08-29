# Changelog

## v1.2.x
**Date:** TBD

* Improved readme by specifying that the layers for the symbol must be text layers.
* Syntax correction where variables were implicitly declared.

## v1.2.3
**Date:** 2017-08-29

* Much headdeskery. Patched an issue where the install link did not actually point to this plugin.

## v1.2.2
**Date:** 2017-08-29

* Updated the readme to better outline this plugin when viewed in the Sketchpacks installer (only the first sentence of the readme file shows up there).
* Added the Install with Sketchpacks badge to the readme file. 

## v1.2.1
**Date:** 2017-08-29

* Added support for Sketchpacks in the manifest.json configuration file.

## v1.2.0
**Date:** 2017-08-28

* Updated the plugin for Sketch 44.0+ by patching an issue where the layer overrides are no longer returned as an object wrapped by an array. They are now returned as just the object itself.

## v1.1.1
**Date:** 2017-04-22

Patch release.
 
* Fixed an issue where the Position-X value when set to 'center' would cause it to behave as if the Position-Y value were also set to 'center'.

## v1.1.0
**Date:** 2017-04-21

Updated release to support some additional word based position options. Until this release it was not possible to have a button automatically position flush with the edges of the parent container.

* Use `left` or `right` for `Position-X` to make button flush to left or right edge.
* Use `top` or `bottom` for `Position-Y` to make button flush to top or bottom edge.

## v1.0.0
**Date:** 2017-04-18

Initial release of functional plugin capable of sizing and positioning a button using a symbol instance.

* Use a symbol as a button.
* Use special layer names in the button symbol to allow setting overrides for:
    * Label
    * Padding-H
    * Padding-V
    * Position-X
    * Position-Y
* Keyboard shortcut `cmd + j` to run resize/reposition command on selected layers.
* Use `center` for position values to center the button.
* Positioning works to parent container (i.e. group, artboard).

