if (Meteor.isClient) {
  Session.setDefault('value', 100);
  var value = function() {
    return Session.get('value');
  }

  Template.hello.width = animate(value);

  Template.hello.events({
    'click .inc': function () {
      Session.set('value', Session.get('value') + 100);
    },
    
    'click .reset': function() {
      Session.set('value', 100);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
