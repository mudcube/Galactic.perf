# Galactic.perf(...)

```
var perf = Galactic.perf()
perf('one-thing')
perf('another-thing')

Galactic.perf((resolve) => {
	// do something and then resolve
	resolve()
}, {
	defer: true,
	name: 'myTest',
	amount: 10
})
```