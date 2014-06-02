if (Meteor.isClient) {
  var PIECES = 5;
  var COLORS = ['red', 'green', 'blue', 'yellow', 'orange'];
  
  var generateFractions = function() {
    return _.times(PIECES, function() {
      return Math.random();
    });
  }
  var layout = d3.layout.pie().sort(null);
  var arc = d3.svg.arc().innerRadius(30).outerRadius(50);
  
  Session.setDefault('fractions', generateFractions());

  Template.pie.helpers({
    fractions: animate(function() { return Session.get('fractions'); },
     d3.ease('cubic-in-out'), d3.interpolateArray),
    
    pieces: function() {
      return _.map(layout(this), function(o, index) {
        return _.extend(o, {index: index});
      });
    },
    
    path: function() {
      return arc(this);
    },
    
    color: function() {
      return COLORS[this.index];
    }
  });
  
  Template.pie.events({
    'click button': function() {
      Session.set('fractions', generateFractions());
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
