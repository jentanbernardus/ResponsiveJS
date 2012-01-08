# ResponsiveJS

### A simple way to constrain JavaScript callbacks according to min-width and max-width values, using the same syntax as media queries.

Free to use for any project – licensed under the MIT license or the GPL license Version 2.

ResponsiveJS is a tiny (1.4kb minified) script that makes it really simple to call JavaScript functions at specific min-width and max-width values, using the same syntax as media queries. By default, your functions are bound to the window resize event, and are also called as you bind them (on page load, for example) – this functionality is optional.

This is handy for things such as conditionally loading content (for a mobile-first approach, for example), and restructuring markup (for small screen/ large screen navigation, etc). 

ResponsiveJS is written in native JavaScript, so you can use it with your framework of choice.

## Usage

```js
ResponsiveJS.bind('(min-width: 320px) and (max-width: 800px)', 
	function(dimensions) {console.log(dimensions); });
```

## bind(query, callback [, fire_now = true])

The `bind()` method takes three parameters:

### `query` string
min-width and/or max-width values using the same syntax as media queries. 

Examples:

`(min-width: 300px) and (max-width: 800px)`
`(max-width: 1024px)`
`(min-width: 500px)`

### `callback` function
A callback function to call when the browser window is resized and the new window dimensions meet the criteria set in `query`. The function is passed an object containing the new window dimensions:

```js
{
	w: window width,
	h: window height,
}
```

By default this callback function is also called as it is bound, if the current browser window dimensions meet the criteria. If, for example, you call the `bind()` method on page load, your callback will fire on page load. To switch this behaviour off see the `fire_now` param below.

### `fire_now` boolean (optional)
If true (default) the callback function is called as it is bound, if the browser dimensions meet the criteria in `query`. Set to false if you only want the function to be called when the browser is resized.

This default behaviour provides an easy way to call your function on page load as well as on browser resize.

## fire()

The `fire()` method fires the callbacks that you have assigned to any min-width and/or max-width constraints that match the current window dimensions. Useful for attaching to events other than window resize or for triggering arbitrarily from within your code.

## Using Namespaces

Namespaces can be used to separate your callback functions. For example, you might want to set a callback to fire when the user clicks on a link, rather than on the window resize event. Here’s how you’d do that (if you’re using jQuery):

```js
ResponsiveJS.bind('my-namespace', '(min-width: 500px)', 
	function(dimensions, namespace) {
		console.log('The browser window is at least 500px wide and you did something to fire callback functions in the "my-namespace" namespace'); 
	},
	false); // false prevents the function from firing as it is bound
$('#click-me').click(function(e) {
	e.preventDefault();
	ResponsiveJS.fire('my-namespace');
});
```

Using a namespace prevents the default behaviour of automatically firing on window resize, and provides a way to segment and group your window width dependent callback functions.

## Without dimensional constraints

Because RespondJS uses the neat (and well documented) little `setTimeout()` trick for the window resize event, you can use it to cover all window resize events, by passing in an empty string as the `query` parameter:

```js
	ResponsiveJS.bind('', function() {do this on window resize}, false);
```

## Credits

Inspired by Scott Jehl's excellent Respond.js, from which the min- and max-width regexes are taken.
