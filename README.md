## Interpolated Helper

Usage:

```
Template.foo.helper = animate(fn, options);
```

Will return a new reactive function that will animate changes to the underlying `fn`.

Options include:
 - `easing` - an easing function to use. :: [0,1] -> [0,1]. (See d3.easing)
 - `interpolator` - an interpolator to use :: (old, new) -> ([0,1] -> intermediate value) (See d3.interpolate)
 - `time` - the time to take to animate between value