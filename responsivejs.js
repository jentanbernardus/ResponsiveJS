
/*
*	A simple way to add javascript listeners to the window 
*	resize event for specific min- and max-width values.
*
*	Usage:
*	ResponsiveJS.bind('(min-width: 320px) and (max-width: 800px)', 
*		function(dimensions) {console.log(dimensions); });
*/

(function(win) {
	
	win.ResponsiveJS = {
	
		listeners: {},
		_default_ns: 'rjs-default-window-resize',
		_default_options: {
			fire_now: true,
			fire_once: false
		},
		
		bind: function(ns, query, callback, options) {
			if (typeof query === 'function') {
				options = callback;
				callback = query;
				query = ns;
				ns = this._default_ns;
			}
			var opts = {};
			for (var key in this._default_options) {
				if (this._default_options.hasOwnProperty(key)) {
					opts[key] = this._default_options[key];
				}
			}
			for (var key in options) {
				if (options.hasOwnProperty(key)) {
					opts[key] = options[key];
				}
			}
			var minw = 
				(query.match(/\(min\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) && parseFloat(RegExp.$1)) || 0;
			var maxw = 
				(query.match(/\(max\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) 
					&& parseFloat(RegExp.$1)) || 1000000;
			var listener = {
				minw: minw,
				maxw: maxw,
				callback: callback,
				options: opts
			};
			if (typeof this.listeners[ns] === 'undefined') {
				this.listeners[ns] = [];
			}
			this.listeners[ns].push(listener);
			if (opts.fire_now) {
				return this._fireListener(this._getDims(), listener, ns, this.listeners[ns].length - 1);
			}
		},
		
		_getDims: function() {
			var e = win, a = 'inner';
			if (!('innerWidth' in win)) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return {w : e[a + 'Width'], h: e[a + 'Height']}
		},
		
		fire: function(ns) {
			var ns = ns || this._default_ns,
				dims = this._getDims();
			for (var i = 0, len = this.listeners[ns].length; i < len; i ++) {
				this._fireListener(dims, this.listeners[ns][i], ns, i);
			}
		},
		
		_fireListener: function(dims, listener, ns, key) {
			if (dims.w >= listener.minw && dims.w <= listener.maxw) {
				if (listener.options.fire_once) {
					this.listeners[ns].splice(key, 1);
				}
				return listener.callback(dims, ns);
			}
		}
		
	};

	var timer;
	resizeFunc = function() {
		if (timer) {clearTimeout(timer); }
		timer = setTimeout(function() {ResponsiveJS.fire(); }, 200);
	};
	if (win.addEventListener) {
		win.addEventListener("resize", resizeFunc, false);
	}
	else if (win.attachEvent) {
		win.attachEvent("onresize", resizeFunc);
	}
		
})(this);