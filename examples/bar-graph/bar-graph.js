if (Meteor.isClient) {
  Session.setDefault('value', 100);
  var value = function() {
    console.log('calculating value');
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
