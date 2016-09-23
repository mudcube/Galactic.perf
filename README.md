# Galactic.perf(...)

### Manual speedmark

```
var perf = Galactic.perf()
perf('one-thing') // logs time since perf was created
perf('another-thing') // logs time since 'one-thing'
```

### Speedmark of 1000 interations

```
Galactic.perf(() => {
	// perform synchronous operation here
}, 1000)
```

### Async speedmark of 1000 interations

```
Galactic.perf((resolve) => {
	// perform asynchronous operation and then...
	resolve()
}, {
	amount: 1000,
	async: true
})
```