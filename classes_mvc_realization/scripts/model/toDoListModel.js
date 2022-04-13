class TodoListModel extends ModelStorage {
	#controller = null;
	dbKey = null;

	registerController(controllerClass) {
		if (this.#controller) throw new Error('Controller instance already exists!')
		this.#controller = controllerClass;
	}

	getData() {
		return this._storageData;
	}

	setData(itemData) {
		if (!this.hasItem()) {
			this.setItem([itemData]);
			return;
		}

		const currentData = [...this._storageData, itemData];
		this.setItem(currentData);
	}

	changeComplitedStatus(id, fieldName, fieldValue) {
		const data = [...this._storageData];

		const currentItem = data.find(item => {
			return item.itemId === +id;
		});

		currentItem[fieldName] = fieldValue;
		this.setItem(data);
	}

	deleteItem(id) {
		const data = [...this._storageData];

		const currentItemIndex = data.findIndex(item => {
			return item.itemId === +id
		});

		data.splice(currentItemIndex, 1);
		this.setItem(data);
	}

	clearStorage() {
		this._clearAll();
	}

	registerDatabaseName(databaseKey) {
		if (this.dbKey) throw new Error('Database Key is already defined');
		this.dbKey = databaseKey
	}
}