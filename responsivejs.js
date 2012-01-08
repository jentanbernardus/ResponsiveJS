
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
		
		bind: function(ns, query, callback, fire_now) {
			if (typeof query === 'function') {
				fire_now = callback;
				callback = query;
				query = ns;
				ns = this._default_ns;
			}
			fire_now = (typeof fire_now === 'undefined') ? true : fire_now;
			var minw = 
				(query.match(/\(min\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) && parseFloat(RegExp.$1)) || 0;
			var maxw = 
				(query.match(/\(max\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) 
					&& parseFloat(RegExp.$1)) || 1000000;
			var listener = {
				minw: minw,
				maxw: maxw,
				callback: callback
			};
			if (typeof this.listeners[ns] === 'undefined') {
				this.listeners[ns] = [];
			}
			this.listeners[ns].push(listener);
			if (fire_now) {
				return this._fireListener(this._getDims(), listener, ns);
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
				this._fireListener(dims, this.listeners[ns][i], ns);
			}
		},
		
		_fireListener: function(dims, listener, ns) {
			if (dims.w >= listener.minw && dims.w <= listener.maxw) {
				return listener.callback(dims, ns);
			}
		}
		
	};

	var timer;
	resizeFunc = function() {
		if (timer) {clearTimeout(timer); }
		timer = setTimeout(function() {ResponsiveJS.fire(); }, 100);
	};
	if (win.addEventListener) {
		win.addEventListener("resize", resizeFunc, false);
	}
	else if (win.attachEvent) {
		win.attachEvent("onresize", resizeFunc);
	}
		
})(this);