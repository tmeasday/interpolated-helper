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
  api.export(['animate']);
});

Package.onTest(function (api) {
  api.use('interpolated-helper');

  api.addFiles('interpolated-helper_tests.js', ['client', 'server']);
});
