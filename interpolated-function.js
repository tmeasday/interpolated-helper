

InterpolatedFunction = function(fn, options) {
  options = options || {};
  this.fn = fn;
  this.easer = new ReactiveEaser(options.easing, options.time);
  this.interpolator = options.interpolator || d3.interpolate;
}

InterpolatedFunction.prototype = new Function();

// "apply" fn to context and arguments, with a key difference
//   - if called inside a computation, will cache the results
//      "per" context + arguments.
//
// The idea being if you repeatedly call it with the same
// context and arguments, it's a noop. But if it reactively
// changes it still triggers reactivity.
InterpolatedFunction.prototype.cachedApply = function(context, arguments) {
  var self = this;
  
  if (! Deps.active)
    return self.fn.apply(context, arguments);
  
  // if the arguments to the function have changed, we'll need to re-establish
  if (! self._lastCall || ! EJSON.equals(self._lastCall.context, context) ||
      ! EJSON.equals(self._lastCall.arguments, arguments)) {
    
    // are we still maintaining the last call?
    self._lastCall && self._lastCall.computation.stop();
  
    self._lastCall = {
      context: context,
      arguments: arguments,
      dependency: new Deps.Dependency
    };

    // we don't want the computation to get stopped whenever the outer 
    // computation stops + re-runs, or we'll need to re-calculate
    Deps.nonreactive(function() {
      self._lastCall.computation = Deps.autorun(function() {
        self._lastCall.value = self.fn.apply(context, arguments);
        self._lastCall.dependency.changed();
      });
    });
    
    // avoid memory leaks -- if the outer computation stops and doesn't
    // rerun us within the flush cycle, we should stop.
    Deps.onInvalidate(function() {
      self._lastCall.inactive = true;
      
      // give the outer run a chance to re-run (if it's gonna),
      // and set us up again
      Deps.afterFlush(function() {
        self._lastCall.inactive && self._lastCall.computation.stop();
      });
    })
  }

  // return our cached value and depend on it
  self._lastCall.dependency.depend();
  self._lastCall.inactive = false;
  return self._lastCall.value;
}

// use two autoruns and "multiplex"
InterpolatedFunction.prototype.call = function(self, arguments) {
  var value = this.cachedApply(self, arguments);
  
  // not sense in interpolating from nothing
  if (_.isUndefined(this._lastValue))
    this._lastValue = value
  
  // hold on, we need to go to a value that we aren't currently interpolating to
  if (! _.isUndefined(this._nextValue) && ! EJSON.equals(value, this._nextValue)) {
    this._lastValue = this._currentValue;
    this.easer.stop();
  }

  // we need to start
  if (! this.easer.running) {
    // the value didn't change, don't start
    if (EJSON.equals(this._lastValue, value))
      return value;
    
    this._nextValue = value;
    this._currentInterpolator = this.interpolator(this._lastValue, value);
    this.easer.start();
  }
  
  var t = this.easer.get();
  
  // we just finished!
  if (t === 1)
    this._lastValue = value;
  
  return this._currentValue = this._currentInterpolator(t);
}