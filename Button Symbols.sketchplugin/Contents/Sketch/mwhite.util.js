/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

if(typeof(Mwhite) == 'undefined' || !(Mwhite instanceof Object)) {
    Mwhite = {};
}

Mwhite.Util = {
    _getClogs: function(args) {
        var clogs = [];
        var argsLength = args.length;
        if(argsLength && ['function', 'object'].indexOf(typeof(console.log)) >= 0) {
            var scalarTypes = ['string', 'boolean', 'number', 'undefined'];
            var previousClogItemType = '';
            for(var i = argsLength; i >= 1; i--) {
                var clogItem = args[argsLength - i];
                var clogItemType = typeof(clogItem);
                // Is scalar?
                if(scalarTypes.indexOf(clogItemType) >= 0 && scalarTypes.indexOf(previousClogItemType) >= 0) {
                    // Concat with previous clog item
                    if(clogItemType == 'boolean') {
                        clogItem = '(' + (clogItem ? 'true' : 'false') + ')';
                    } else if (clogItemType == 'undefined') {
                        clogItem = '(undefined)';
                    }
                    clogs[clogs.length - 1] += ': ' + clogItem;
                } else {
                    clogs.push(clogItem);
                }
                previousClogItemType = clogItemType;
            }
        }
        return clogs;
    },
    clog: function() {
        var args = Array.prototype.slice.call(arguments);
        var clogs = Mwhite.Util._getClogs(args);
        for(var i in clogs) {
            if(clogs.hasOwnProperty(i)) {
                var clogItem = clogs[i];
                console.log(clogItem);
            }
        }
    }
};

if(typeof(clog) != 'function') {
    clog = Mwhite.Util.clog;
}
