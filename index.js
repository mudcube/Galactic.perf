function Perf(handler, options) {
	var amount = Number.isFinite(options) ? options : 1
	var async = false
	var elapsed = true
	var title = ''

	if (typeof handler === 'function') {
		if (typeof options === 'object') {
			amount = Number.isFinite(options.amount) ? options.amount : amount
			async = !!options.async || async
			elapsed = !!options.elapsed || elapsed
			title = options.title || title
		}

		ping()
		if (async) {
			handleAsync()
		} else {
			handleSync()
		}
	}

	var startAt = getTime()

	ping.reset = function () {
		startAt = getTime()
	}

	return ping

	function ping(args) {
		var now = getTime()
		var lapse = Math.round(now - startAt)
		if (args) {
			log(lapse, args)
		}
		if (elapsed) {
			startAt = now
		}
		return lapse
	}

	function handleSync() {
		while(--amount > -1) handler()
		report()
	}

	function handleAsync() {
		if (--amount > -1) {
			handler(handleAsync)
		} else {
			report()
		}
	}

	function report() {
		console.log(ping() + 'ms', title)
	}
}

function log(lapse, args) {
	if (canLogColors()) {
		args = Array.prototype.slice.call(arguments)
		args.unshift('background: #222; color: #bbff00; padding: 0 3px; border-radius: 3px;')
		args.unshift(`%c${lapse}ms`)
		console.log.apply(console, args)
	} else {
		console.log(lapse + 'ms', args)
	}
}

function canLogColors() {
	if (typeof window === 'undefined') return false
	return !!window.chrome
}

var getTime = (() => {
	if (typeof window === 'object' && window.performance && window.performance.now) {
		var performance = window.performance
		return performance.now.bind(performance)
	}
	var start = Date.now()
	return function () {
		return Date.now() - start
	}
})()

module.exports = Perf