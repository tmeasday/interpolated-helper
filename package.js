Package.describe({
  name: 'percolate:interpolated-helper',
  summary: "Provides a reactive interpolate framework"
});

Package.onUse(function (api, where) {
  api.use(['deps', 'underscore', 'd3']);
  
  api.addFiles([
    'reactivevar.js',
    'reactive-easer.js',
    'interpolated-function.js',
    'helpers.js'
  ], ['client', 'server']);
  
  api.export(['ReactiveEaser', 'InterpolatedFunction']);
  // XXX: clean this up
  api.export(['animate', 'interpolate']);
});

Package.onTest(function (api) {
  api.use('interpolated-helper');

  api.addFiles('interpolated-helper_tests.js', ['client', 'server']);
});
