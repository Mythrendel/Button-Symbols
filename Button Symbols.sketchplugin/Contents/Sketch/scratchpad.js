

var layers = context.selection;

for(var k = 0; k < layers.count(); k++) {
    var layer = layers[k];

    log(layer.name() + ': ' + layer.objectID() + '');
}
