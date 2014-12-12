ReactiveEaser = function(easingFn, defaultTime) {
  ReactiveVar.call(this, 0);
  
  if (! _.isFunction(easingFn)) {
    defaultTime = easingFn;
    easingFn = null;
  }
  
  this.easingFn = easingFn || d3.ease('cubic-in-out');
  this.defaultTime = defaultTime || 1000;
  this.running = false;
  this._direction = 'up';
}

ReactiveEaser.prototype = _.extend(new ReactiveVar, {
  set: function(t) {
    if (this._direction === 'down') 
      t = 1 - t;
    ReactiveVar.prototype.set.call(this, t);
  },
  
  start: function(time, cb) {
    this.set(0);
    this.resume(time, cb);
  },
  
  resume: function(time, cb) {
    if (_.isFunction(time)) {
      cb = time;
      time = false;
    }
    
    if (this.running)
      throw new Meteor.Error("Can't start an easer that's already running!");
    
    var self = this;
    time = time || self.defaultTime;
    
    var startedAt
    var initial = Tracker.nonreactive(function() { return self.get(); });
    var final = 1;
    var step = function(timestamp) {
      startedAt = startedAt || timestamp;
      var elapsed = timestamp - startedAt;
      
      if (elapsed < time) {
        var current = initial + (elapsed / time) * (final - initial);
        self.set(self.easingFn(current));
        self.rafID = requestAnimationFrame(step);
      } else {
        self.set(final)
        // give listeners a chance to read the 1 value before stopping
        Deps.afterFlush(function() {
          self.stop();
          if (cb)
            cb();
        });
      }
    }

    self.set(0);
    self.running = true;
    self.rafID = requestAnimationFrame(step);
  },
  
  stop: function() {
    if (this.running) {
      if (this.rafID)
        cancelAnimationFrame(this.rafID);
      
      this.running = false;
    }
  },
  
  restart: function() {
    this.stop();
    this.start();
  },
  
  loop: function() {
    var self = this;
    var go = function() {
      self.resume(function() {
        if (self._finish) {
          self._finish();
          self._finish = null;
        } else {
          self.set(0);
          go(); // go again
        }
      });
    }
    
    go();
  },
  
  bounce: function() {
    var self = this;
    var go = function() {
      // reverse direction
      self._direction = (self._direction === 'up' ? 'down' : 'up');
      self.start(go);
    }
    self._direction = 'down';
    go();
  },
  
  // complete the current loop/bounce(TODO) and call done
  finish: function(done) {
    this._finish = done;
  },
  
  // not sure if these should go on here but hey
  
  // Use d3.interpolate to go between a, b driven by our behaviour
  interpolate: function(a, b) {
    return this.ease(d3.interpolate(a, b));
  },
  
  // turn f into an "eased" reactive function
  ease: function(f) {
    var self = this;
    return function() {
      return f(self.get())
    }
  }
});