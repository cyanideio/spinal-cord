# exo
Yet another Backbone-like framework, but in ES6.

The goal of exo is to provide a minimalist skeleton from which to create
ES2015 applications, but with a minimal build step as well. Because of this
the usage of ES6 modules and default arguments were excluded since they are
not yet supported by most browsers.  

In lieu of ES6 modules, node modules were used, and the dist directory
contains a build done with browserify. All of the example code and tests
rely on browserify as well. But as soon as one of the major browsers starts
supporting ES6 modules, this will be replaced. So as you may have guessed,
this library is not for everyone, it is for those looking for code for the
future, and those who don't need to worry about supporting older browsers.  

**exo** provides the same objects as Backbone, but instead they are ES6
 classes which you can extend from. Here is an explanation of each of them.
 They all extend the EventEmitter class as well, so you can use methods
 such as ```addListener```, ```addOneTimeListener``` and ```removeListener```.

 **Model**

 **Collection**

 **View**

 **Router**


 **exo** also provides a few helper methods to get you started.

 **ExoAJAX**

 **FetchFile**

 **Ensure**

 Finally, there is a property that is exported so you know that
 everything loaded properly. ```loaded_properly```
