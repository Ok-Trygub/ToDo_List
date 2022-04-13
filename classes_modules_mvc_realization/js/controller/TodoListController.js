export class TodoListController {
	_formSelector = null;
	_todosContainerSelector = null;
	_removeAllSelector = null;
	_formFields = null;

	_currentItemId = 0;

	_form = null;
	_todoItemsContainer = null;
	clearAllBtn = null;

	#view = null;
	#model = null;

	constructor(formConfiguration, ViewClass, ModelClass) {
		this.#setView(ViewClass);
		this.#setModel(ModelClass);

		this._formSelector = formConfiguration.form;
		this.form = TodoListController.#getElementFromDOM(this.formSelector);
		this.#setFormSubmitEvent();
		this.#getFields();

		this._todosContainerSelector = formConfiguration.todoItemsContainer;
		this.todoItemsContainer = TodoListController.#getElementFromDOM(this.todosContainerSelector);

		this._removeBtnSelector = formConfiguration.removeAllBtn;
		this.clearAllBtn = TodoListController.#getElementFromDOM(this._removeBtnSelector);

		this.#model.registerController(this);
		this.#model.registerDatabaseName(this.formSelector);

		this.#setChangeStatusEvent();
		this.#setRemoveItemEvent();
		this.#setClearFormEvent();
		this.#setWindowOnloadEvent();

	}

	get formSelector() {
		return this._formSelector;
	}

	set form(formNode) {
		this.#view.setForm(formNode);
		this._form = formNode;
	}

	get form() {
		return this._form;
	}

	static #getElementFromDOM(elemSelector) {
		const elem = document.querySelector(elemSelector);

		if (!(elem instanceof HTMLElement)) {
			throw new Error('It is not HTML element!')
		}
		return elem;
	}

	get todosContainerSelector() {
		return this._todosContainerSelector;
	}

	set todoItemsContainer(containerNode) {
		this.#view.setTodoItemsContainer(containerNode);
		this._todoItemsContainer = containerNode;
	}

	get todoItemsContainer() {
		return this._todoItemsContainer;
	}

	get removeBtnSelector() {
		return this._removeBtnSelector;
	}

	#setView(ViewClass) {
		this.#view = new ViewClass(this);
	}

	#setModel(ModelClass) {
		this.#model = new ModelClass(this);
	}

	get currentItemId() {
		return this._currentItemId;
	}

	set currentItemId(id) {
		if (id === 0) throw new Error('ID cannot be 0');

		if (id === this._currentItemId) {
			throw new Error('ID of current element the same as ID of previous element');
		}
		this._currentItemId = id;
	}

	#getFields() {
		this.formFields = this.form.querySelectorAll(
			'input[type=text], textarea'
		);
	}

	get formFields() {
		return this._formFields;
	}

	set formFields(fieldsList) {
		if (fieldsList && !fieldsList.length) {
			throw new Error('You cannot set empty inputs list');
		}
		this._formFields = fieldsList;
	}

	#findInputsData() {
		const inputsData = Array.from(this.formFields)
			.reduce((accum, item) => {
				accum[item.name] = item.value;
				return accum;
			},
				{});
		return inputsData;
	}

	#validateInputs() {
		let formValidated = true;

		for (const inputNode of this.formFields) {
			if (inputNode.value.trim()) continue;

			formValidated = false;
			this.#view.showInputsError(inputNode);
		}

		return formValidated;
	}

	formSubmitHandler(event) {
		event.preventDefault();
		event.stopPropagation();

		if (!this.#validateInputs()) return;

		this.currentItemId += 1;

		let data = {
			completed: false,
			itemId: this.currentItemId,
			...this.#findInputsData()
		}

		this.#model.setData(data);
		this.#view.renderItem(data);
		this.#view.clearForm();
	}

	#setFormSubmitEvent() {
		this.form.addEventListener(
			'submit',
			this.formSubmitHandler.bind(this)
		)
	}

	changeStatusHandler(event) {
		event.stopPropagation();
		const { target } = event;

		const id = target.getAttribute('data-item-id');
		const status = target.checked;

		this.#model.patchData(id, 'completed', status);
	}

	#setChangeStatusEvent() {
		this.todoItemsContainer.addEventListener(
			'change',
			this.changeStatusHandler.bind(this),
		)
	}

	removeItemHandler(event) {
		event.stopPropagation();
		const { target } = event;
		if (!target.hasAttribute('data-remove-btn')) return;

		const itemId = target.getAttribute('data-item-id');

		this.#model.deleteData(itemId);
		this.#view.removeTodoItem(itemId);
	}

	#setRemoveItemEvent() {
		this.todoItemsContainer.addEventListener(
			'click',
			this.removeItemHandler.bind(this),
		);
	}

	clearFormHandler = (event) => {
		event.preventDefault();
		event.stopPropagation();

		this.#model.clearDatabase();
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

		const data = this.#model.getData();

		for (const todoItem of data) {
			this.#view.renderItem(todoItem);
		}
		this.currentItemId = data[data.length - 1].itemId;
	}

	#setWindowOnloadEvent() {
		window.addEventListener(
			'DOMContentLoaded',
			this.windowOnloadHandler.bind(this),
		)
	}
}