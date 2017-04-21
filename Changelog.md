# Changelog

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

