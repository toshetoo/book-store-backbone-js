/*global Backbone */
var app = app || {};

(function () {
	'use strict';
	app.Book = Backbone.Model.extend({
		defaults: {
			title: '',
			read: false
		},
		
		toggleReadState: function () {
			this.save({
				read: !this.get('read')
			});
		}
	});
})();