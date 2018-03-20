/*

    Debugging plugins via the Safari console is a pain because each run opens a new console window.

    Open the Plugins > Run Script menu in Sketch and paste in the script below. By using this you can call any ButtonSymbols method directly to test it.

    Just use clog() anywhere in the plugin to log to the Sketch plugin console if available; otherwise it will log to the Safari console if available.


    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    Useful tip: Reloading sketch plugins every time you change something is painful.

    Navigate to: /Users/mwhite/Library/Application Support/com.bohemiancoding.sketch3/Plugins/Button Symbols.sketchplugin/Contents/Sketch

    Remove the button-symbols.js file and create a symlink named button-symbols.js that points to the copy of that file inside the repository.
    Also do this for any other files being worked on.

*/

const sketch = require('sketch');

@import 'Button Symbols.sketchplugin/Contents/Sketch/mwhite.base-class.js'
@import 'Button Symbols.sketchplugin/Contents/Sketch/mwhite.util.js'
@import 'Button Symbols.sketchplugin/Contents/Sketch/button-symbols.js'

var bs = new ButtonSymbols(context);
bs.updateSelectedButtons();
