ReactiveEaser = function(easingFn, defaultTime) {
  ReactiveVar.call(this, 1);
  this.easingFn = easingFn || d3.ease('cubic-in-out');
  this.defaultTime = defaultTime || 1000;
  this.running = false
}

ReactiveEaser.prototype = _.extend(new ReactiveVar, {
  start: function(time) {
    if (this.running)
      throw new Meteor.Error("Can't start an easer that's already running!");
    
    var self = this;
    time = time || self.defaultTime;
    
    var startedAt;
    var step = function(timestamp) {
      startedAt = startedAt || timestamp;
      var elapsed = timestamp - startedAt;
      
      if (elapsed < time) {
        self.set(self.easingFn(elapsed / time));
        self.rafID = requestAnimationFrame(step);
      } else {
        self.set(1)
        // give listeners a chance to read the 1 value before stopping
        Deps.afterFlush(function() {
          self.stop();
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
      
      this.set(1);
      this.running = false;
    }
  },
  
  restart: function() {
    this.stop();
    this.start();
  }
});