// should this be a parameter?
var N_TICKS = 100;
ReactiveEaser = function(easingFn, defaultTime) {
  ReactiveVar.call(this, 1);
  this.easingFn = easingFn || d3.ease('cubic-in-out');
  this.defaultTime = defaultTime || 1000;
  this.running = false
}

ReactiveEaser.prototype = _.extend(new ReactiveVar, {
  start: function(time) {
    var self = this;
    time = time || self.defaultTime;
    
    var tickSize = time / N_TICKS;
    
    var i = 0;
    self.set(0);
    self.running = true;
    self._interval = Meteor.setInterval(function() {
      i += 1;
      if (i <= N_TICKS)
        self.set(self.easingFn(i / N_TICKS));
      else 
        self.stop();
    }, tickSize);
  },
  
  stop: function() {
    if (this.running) {
      this.set(1);
      this.running = false;
      Meteor.clearInterval(this._interval);
    }
  },
  
  restart: function() {
    this.stop();
    this.start();
  }
});