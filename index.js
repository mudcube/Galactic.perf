function Perf(handler, args) {
	var perf
	var amount = Number.isFinite(args) ? args : 1
	var async = false
	var elapsed = true
	var title = ''

	if (typeof handler === 'function') {
		if (typeof args === 'object') {
			amount = Number.isFinite(args.amount) ? args.amount : amount
			async = !!args.async || async
			elapsed = !!args.elapsed || elapsed
			title = args.title || title
		}

		perf = perfLogger()

		if (async) {
			handleAsync()
			return
		}

		while(--amount > -1) {
			handler()
		}

		report()
		return
	}

	var startAt = getTime()

	perfLogger.reset = function () {
		startAt = getTime()
	}

	return perfLogger

	function perfLogger(args) {
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

	function handleAsync() {
		if (--amount > -1) {
			handler(handleAsync)
		} else {
			report()
		}
	}

	function report() {
		console.log(perfLogger() + 'ms', title)
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