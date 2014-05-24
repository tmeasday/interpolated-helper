// XXX: what to do if there is no key?
var keyForAnimation = function(doc) {
  return doc._id;
}

animate = function(fn) {
  return function() {
    fn.interpolators = fn.interpolators || {};
    
    var key = keyForAnimation(this);
    if (! fn.interpolators[key])
      fn.interpolators[key] = new InterpolatedFunction(fn);
    
    return fn.interpolators[key].call(this, arguments);
  }
}