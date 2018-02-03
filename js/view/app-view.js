var app = app || {};

(function ($) {
	'use strict';

	// top-level piece of UI
	app.AppView = Backbone.View.extend({
		el: '.bookstore-app', // bind to already existing element

		// statistics
		statsTemplate: _.template($('#stats-template').html()),

		// bind events
		events: {
			'keypress .new-book': 'createOnEnter',
			'click .clear-read': 'clearRead',
			'click .toggle-all': 'markAllAsRead'
		},

		
		initialize: function () {
			this.allCheckbox = this.$('.toggle-all')[0];
			this.$input = this.$('.new-book');
			this.$footer = this.$('.footer');
			this.$main = this.$('.main');
			this.$list = $('.books-list');

			this.listenTo(app.books, 'add', this.add);
			this.listenTo(app.books, 'reset', this.addAll);
			this.listenTo(app.books, 'change:read', this.filter);
			this.listenTo(app.books, 'filter', this.filterAll);
			this.listenTo(app.books, 'all', _.debounce(this.render, 0));

			
			// Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.books.fetch({reset: true});
		},

		// refreshing the statistics 
		render: function () {
			var read = app.books.read().length;
			var remainingBooks = app.books.remainingBooks().length;

			if (app.books.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					read: read,
					remainingBooks: remainingBooks
				}));

				this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.AppFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remainingBooks;
		},

		add: function (book) {
			var view = new app.BookView({ model: book });
			this.$list.append(view.render().el);
		},

		addAll: function () {
			this.$list.html('');
			app.books.each(this.add, this);
		},

		filter: function (book) {
			book.trigger('visible');
		},

		filterAll: function () {
			app.books.each(this.filter, this);
		},

		getNewBook: function () {
			return {
				title: this.$input.val().trim(),
				order: app.books.nextOrder(),
				read: false
			};
		},

		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.books.create(this.getNewBook());
				this.$input.val('');
			}
		},

		clearRead: function () {
			_.invoke(app.books.read(), 'destroy');
			return false;
		},

		markAllAsRead: function () {
			var read = this.allCheckbox.checked;

			app.books.each(function (book) {
				book.save({
					read: read
				});
			});
		}
	});
})(jQuery);