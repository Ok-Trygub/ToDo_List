'use strict';

const app = (() => {

	const formConfiguration = {
		form: '#todoForm',
		todoContainer: '#todoItems',
		removeBtn: '.remove-all'
	}

	const controller = new TodoListController(
		formConfiguration,
		TodoListView,
		TodoListModel
	)
	return controller;
})();