/*global Backbone */
var app = app || {};

(function () {
	'use strict';
	var AppRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			app.AppFilter = param || '';
			app.books.trigger('filter');
		}
	});

	app.AppRouter = new AppRouter();
	Backbone.history.start();
})();