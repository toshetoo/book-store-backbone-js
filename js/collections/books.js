/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Books = Backbone.Collection.extend({
		model: app.Book,

		localStorage: new Backbone.LocalStorage('books-backbone'),

		read: function () {
			return this.where({read: true});
		},

		remaining: function () {
			return this.where({read: false});
		},

		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		comparator: 'order'
	});

	app.books = new Books();
})();