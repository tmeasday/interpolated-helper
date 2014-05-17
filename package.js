Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.use(['deps', 'underscore']);
  
  api.add_files([
    'reactivevar.js',
    'reactive-easer.js',
    'interpolated-function.js',
  ], ['client', 'server']);
  
  api.export(['ReactiveEaser', 'InterpolatedFunction']);
});

Package.on_test(function (api) {
  api.use('interpolated-helper');

  api.add_files('interpolated-helper_tests.js', ['client', 'server']);
});
