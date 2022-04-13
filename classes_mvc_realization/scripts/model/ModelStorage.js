class ModelStorage {
	#hasItem() {
		let data = localStorage.getItem(this.dbKey);

		if (data === null){
			return false;
		} 
		return !!JSON.parse(data).length;
	}

	hasItem() {
		return this.#hasItem();
	}

	#setItem(itemData) {
		return localStorage.setItem(
			this.dbKey,
			JSON.stringify(itemData)
		);
	}

	setItem(itemData) {
		return this.#setItem(itemData);
	}

	#storageData() {
		return JSON.parse(localStorage.getItem(this.dbKey));
	}

	get _storageData() {
		return this.#storageData();
	}

	_clearAll() {
		localStorage.removeItem(this.dbKey);
}
}