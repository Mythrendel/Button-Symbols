/**
 * @author Michael White
 * @copyright 2017 Michael White
 */

if(typeof(Mwhite) == 'undefined' || !(Mwhite instanceof Object)) {
    Mwhite = {};
}

(function() {
    /**
     * This class system is based on: http://ejohn.org/blog/simple-javascript-inheritance/
     *
     * Some examples for usage:
     *
     * Note that this class is designed to mimic PHP's inheritance model as closely as practical.
     *
     * BaseClass.__construct() is called automatically when you create a new instance of the class like "new MyClassName();"
     * Inside any method (including the __construct() method) you can use "this._parent()" to call the parent class' version of the current method.
     *
     var foo = Mwhite.BaseClass.extend({
                __construct: function() {
                    clog('Foo constructed');
                },
                outputTest: function() {
                    console.log('I am foo');
                }
            });

     var bar = foo.extend({
                output: function() {
                    console.log(this);
                    console.log('I am bar');
                    console.log('But my parent is...');
                    this._parent();
                    console.log('Done with parent call.');
                }
            });

     var myFoo = new foo();
     myFoo.output(); // outputs "I am foo"

     var myBar = new bar();
     myBar.output(); // outputs "I am bar", "But my parent is...", "I am foo", "Done with parent call."
     */

    Mwhite.BaseClass = function() {};
    Mwhite.BaseClass.__constructing = false;

    // Older version of Safari, Mobile Opera, and Blackberry browsers do not necessarily return valid or useful data from the function prototype.toString() method.
    // So this test avoids using the flawed .toString() methods of the function prototype by letting the the RegExp.test() method handle the conversion to a string.
    // The test itself checks if the function contains a call to _parent.
    var _callToParentTest = /abc_mwhite/.test(function(){var abc_mwhite;}) ? /\b_parent\b/ : /.*/;

    // Create a new BaseClass that inherits from this class
    // It is important to understand that the classes created by this system are represented by functions, not by objects.
    // The use of functions to mimic classes is how the scope of individual instances are preserved. This preserved scope is
    // also leveraged to add the ability to make calls to the parent method.
    Mwhite.BaseClass.extend = function(classObject) {
        // "this" references the class being extended (aka the "parent" class)
        // Here we store a reference to the parent class as a local variable that can later be accessed by the child class.
        // By doing this, the parent class will not be "merged" with child class but rather will live on inside of the child class.
        var _parentInstance = this.prototype;

        Mwhite.BaseClass.__constructing = true;
        // Create a new instance of the "parent" class. This is what will be extended with the additional methods and properties from the child class.
        // Using a new instance is how the scope and integrity of the parent class' methods and properties are preserved.
        var prototype = new this();
        Mwhite.BaseClass.__constructing = false;

        // This is run when a method is found that contains a call to _parent. Its job is to proxy the parent class'
        // method as a property named _parent directly on the using method's prototype.
        var parentProxyClosure = function(name, originalMethod) {
            return function() {
                // When a child class' method is found to have a call to this._parent(), that method is replaced with this method.
                // This happens during the extending process before the method is ever called.
                // The original version of the method (before it was swapped out) is available by reference to the outer (proxy) method's argument originalMethod
                // "this" references the instance of the child class from which this._parent() is being called.

                // Store child class' parent property for later restoration.
                var tmpFn = this._parent;

                // When calling the original method we want to force the this._parent property to be the parent class' version of the current method based on the method name.
                this._parent = _parentInstance[name];

                // Call the original method with the current class scope and arguments list. Store the result for later use.
                var result = originalMethod.apply(this, arguments);

                // Restore the value of this._parent to what it was prior to overriding it for purposes of the method call.
                this._parent = tmpFn;

                // Return the result returned by the call to the original method. This effectively completes the method proxy flow.
                return result;
            };
        };

        // For the purposes of this loop, propertyName may also represent a property that stores a function and thus serving as a method of the class.
        for(var propertyName in classObject) {
            // Check if the target class actually owns the property we are currently checking.
            if(classObject.hasOwnProperty(propertyName)) {
                var isValidMethod = (typeof(classObject[propertyName]) == 'function');
                var parentHasSameMethod = (typeof(_parentInstance[propertyName]) == 'function');
                var hasCallToParentMethod = isValidMethod && parentHasSameMethod && _callToParentTest.test(classObject[propertyName]);
                // If this property is a method, has a parent class with the same method name, and this method's code
                // contains a call to its parent method, replace this method (original method) with a proxy function
                // that will properly set the value of the "this._parent" property before calling the original method.
                // This is how a call to "this._parent()" does not result in calls to undefined properties even when it
                // appears that no such property exists on the class.
                prototype[propertyName] = hasCallToParentMethod ? parentProxyClosure(propertyName, classObject[propertyName]) : classObject[propertyName];
            }
        }

        // This function will become the new class.
        // The BaseClass function calls a constructor method on the class when it is instantiated.
        var BaseClass = function() {
            // Ensure the class initialization system does not call the constructor method.
            if(!Mwhite.BaseClass.__constructing && this.__construct) {
                this.__construct.apply(this, arguments);
            }
        };

        // We created an instance of the "parent" and then added properties and methods to it. Set this as the prototype of the new class.
        BaseClass.prototype = prototype;

        // Set the BaseClass function as its own JavaScript constructor method that is used when called with the "new" keyword.
        BaseClass.constructor = BaseClass;

        // This method is the method that performs the extend action. Ensure that every child class also obtains the functionality to be extended.
        BaseClass.extend = arguments.callee;

        // Return the newly created class.
        return BaseClass;
    };
})();
