// XXX: not sure if this is the correct pattern at all but let's go

InterpolatedFunction = function(fn, easing, interpolator) {
  this.fn = fn;
  this.easing = easing || _.identity;
  this.easer = new ReactiveEaser(easing);
  this.interpolator = interpolator || function(f, x, y) { 
    return x + (y - x) * f; 
  };
}

InterpolatedFunction.prototype = new Function();

InterpolatedFunction.prototype.call = function(self, arguments) {
  var value = this.fn.call(self, arguments);
  
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
    this.easer.start();
  }
  
  var f = this.easer.get();
  
  // we just finished!
  if (f === 1)
    this._lastValue = value;
  
  return this._currentValue = this.interpolator(f, this._lastValue, value);
}