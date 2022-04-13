export class TodoModelStorage {
	
	#getStorageData() {
		return JSON.parse(
			localStorage.getItem(this.dbKey)
		);
	}

	get _data() {
		return this.#getStorageData();
	}

	#setItem(data) {
		return localStorage.setItem(
			this.dbKey,
			JSON.stringify(data)
		);
	}

	#hasItem() {
		let data = localStorage.getItem(this.dbKey);
		if (data === null) return false;

		return !!JSON.parse(data).length;
	}

	_clearAll() {
		localStorage.removeItem(this.dbKey);
	}

	setItem(data) {
		this.#setItem(data);
	}

	hasItem() {
		return this.#hasItem()
	}
}