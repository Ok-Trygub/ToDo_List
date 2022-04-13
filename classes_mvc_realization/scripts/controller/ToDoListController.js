class TodoListController {
	_formSelector = null;
	_todoContainerSelector = null;
	_clearBtnSelector = null;

	_form = null;
	_todoItemsContainer = null;
	clearAllBtn = null;

	_formInputsFields = null;
	_currentItemId = 0;

	#view = null;
	#model = null;


	constructor(formConfiguration, View, Model) {
		this.#setView(View);
		this.#setModel(Model);

		this._formSelector = formConfiguration.form;
		this._todoContainerSelector = formConfiguration.todoContainer;
		this._clearBtnSelector = formConfiguration.removeBtn;

		// form config:
		this.form = TodoListController.#getElementFromSelector(this.formSelector);
		this.#setFormSubmitEvent();
		this.#getInputsFields();

		this.clearAllBtn = TodoListController.#getElementFromSelector(this.clearBtnSelector);
		this.#setClearFormEvent();

		// todoContainer config:
		this.todoItemsContainer = TodoListController.#getElementFromSelector(this.todoContainerSelector);
		this.#setComplitedStatus();
		this.#setRemoveItemEvent();

		// Connect model and controller:
		this.#model.registerController(this);
		this.#model.registerDatabaseName(this._formSelector);

		// ! Fill data:
		this.#setWindowOnloadEvent();
	}

	get formSelector() {
		return this._formSelector;
	}

	get todoContainerSelector() {
		return this._todoContainerSelector;
	}

	get clearBtnSelector() {
		return this._clearBtnSelector;
	}

	static #getElementFromSelector(elemSelector) {
		const elem = document.querySelector(elemSelector);

		if (!(elem instanceof HTMLElement)) {
			throw new Error('It is not a HTML element!')
		}
		return elem;
	}

	#setView(View) {
		this.#view = new View(this);
	}

	#setModel(Model) {
		this.#model = new Model();
	}

	set form(formNode) {
		this.#view.setForm(formNode);
		this._form = formNode;
	}

	get form() {
		return this._form;
	}

	set todoItemsContainer(containerNode) {
		this.#view.setTodoContainer(containerNode);
		this._todoItemsContainer = containerNode;
	}

	get todoItemsContainer() {
		return this._todoItemsContainer;
	}

	#getInputsFields() {
		this.formInputsFields = this.form.querySelectorAll(
			'input[type=text], textarea'
		);
	}

	set formInputsFields(fields) {
		if (fields && !fields.length) {
			throw new Error("There aren't inputs fields");
		}
		this._formInputsFields = fields;
	}

	get formInputsFields() {
		return this._formInputsFields;
	}

	set currentItemId(id) {
		if (id === 0) throw new Error('ID cannot be 0');

		if (id === this._currentItemId) {
			throw new Error('ID of current element the same as ID of previous element');
		}
		this._currentItemId = id;
	}

	get currentItemId() {
		return this._currentItemId;
	}

	#validateInputData() {
		let validatedForm = true;

		for (let inputNode of this.formInputsFields) {
			if (inputNode.value.trim()) continue;

			validatedForm = false;
			this.#view.showInputsError(inputNode);
		}
		return validatedForm;
	}

	#findInputsData() {
		const inputsData = Array.from(this.formInputsFields)
			.reduce((accum, item) => {
				accum[item.name] = item.value;
				return accum;
			},
				{}
			)
		return inputsData;
	}

	formSubmitHandler(event) {
		event.preventDefault();
		event.stopPropagation();

		if (!this.#validateInputData()) return;

		this.currentItemId++;

		const data = {
			itemId: this.currentItemId,
			completed: false,
			...this.#findInputsData(),
		}

		this.#model.setData(data);
		this.#view.renderItem(data);
		event.target.reset();
	}

	#setFormSubmitEvent() {
		this.form.addEventListener(
			'submit',
			this.formSubmitHandler.bind(this)
		)
	}

	completedStatusHandler(event) {
		event.stopPropagation();
		const { target } = event;

		const id = target.getAttribute('data-item-id');
		const status = target.checked;

		this.#model.changeComplitedStatus(id, 'completed', status);
	}

	#setComplitedStatus() {
		this.todoItemsContainer.addEventListener(
			'change',
			this.completedStatusHandler.bind(this)
		)
	}

	removeItemHandler(event) {
		event.stopPropagation();
		const { target } = event;

		if (!target.hasAttribute('data-remove-btn')) return;

		const itemId = target.getAttribute('data-item-id');

		this.#model.deleteItem(itemId);
		this.#view.removeTodoItem(itemId);
	}

	#setRemoveItemEvent() {
		this.todoItemsContainer.addEventListener(
			'click',
			this.removeItemHandler.bind(this)
		)
	}

	clearFormHandler(event) {
		event.preventDefault();
		event.stopPropagation();

		this.#model.clearStorage();
		this.#view.removeAllTodos();
	}

	#setClearFormEvent() {
		this.clearAllBtn.addEventListener(
			'click',
			this.clearFormHandler.bind(this)
		)
	}

	windowOnloadHandler() {
		if (!this.#model.hasItem()) return;

		const data = [...this.#model.getData()];

		for (const todoItem of data) {
			this.#view.renderItem(todoItem);
		}
		this.currentItemId = data[data.length - 1].itemId;
	}

	#setWindowOnloadEvent() {
		window.addEventListener(
			'DOMContentLoaded',
			this.windowOnloadHandler.bind(this)
		)
	}
}