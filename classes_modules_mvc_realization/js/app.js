'use strict';

import { TodoListController as Controller } from './controller/TodoListController.js';
import { TodoListModel as Model } from './model/TodoListModel.js';
import { TodoListView as View } from './view/TodoListView.js';

const app = (() => {
	const formConfiguration = {
		form: '#todoForm',
		todoItemsContainer: '#todoItems',
		removeAllBtn: '.remove-all'
	}


	const controller = new Controller(
		formConfiguration,
		View,
		Model
	)

	return controller;
})();