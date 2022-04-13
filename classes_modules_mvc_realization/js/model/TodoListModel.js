import { TodoModelStorage as Storage } from './TodoModelStorage.js'

export class TodoListModel extends Storage {
	#controller = null;
	dbKey = null;

	getData() {
		return this._data;
}

	setData(todoItemData) {
		if (!this.hasItem()) {
			this.setItem([todoItemData]);
			return;
		}

		const currentData = [...this._data, todoItemData];
		this.setItem(currentData);
	}

	registerController(controllerInstance) {
		if (this.#controller) throw new Error('Controller is already defined');
		this.#controller = controllerInstance;
	}

	registerDatabaseName(databaseKey) {
		if (this.dbKey) throw new Error('Database Key is already defined');
		this.dbKey = databaseKey;
	}

	patchData(id, fieldName, fieldValue) {
		const data = [...this._data];
		const currentItem = data.find(todoItem => {
			return todoItem.itemId === +id
		});

		currentItem[fieldName] = fieldValue;
		this.setItem(data);
	}

	deleteData(id) {
		const data = [...this._data];
		const currentItemIndex = data.findIndex(todoItem => {
			return todoItem.itemId === +id
		});

		data.splice(currentItemIndex, 1);
		this.setItem(data);
	}

	clearDatabase() {
		this._clearAll();
	}
}