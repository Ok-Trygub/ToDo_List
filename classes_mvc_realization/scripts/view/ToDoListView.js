class TodoListView {
	#controller = null;
	#form = null;
	#todoItemsContainer = null;

	constructor(controller) {
		this.#controller = controller;
	}

	setForm(formNode) {
		if (this.#form) throw new Error('Form already defined');
		this.#form = formNode;
	}

	setTodoContainer(containerNode) {
		if (this.#todoItemsContainer) throw new Error('Todo Container already defined');
		this.#todoItemsContainer = containerNode;
	}

	showInputsError(inputNode) {
		const inputTitle = inputNode.previousElementSibling.textContent
		console.log(`${inputTitle} value is empty!`);
	}

	createElement(nodeName, classes, innerContent) {
		const el = document.createElement(nodeName);

		if (!classes && !innerContent) return el;

		if (Array.isArray(classes)) {
			classes.forEach((singleClassName) => {
				el.classList.add(singleClassName);
			});
		} else {
			el.classList.add(classes);
		}

		if (innerContent) {
			el.innerHTML = innerContent;
		}
		return el;
	}

	_createTemplate({ title, description, itemId, completed }) {
		const todoItem = this.createElement("div", "col-4");
		const taskWrapper = this.createElement("div", "taskWrapper");
		todoItem.setAttribute(`data-todo-item-${itemId}`, '');
		todoItem.append(taskWrapper);

		const taskHeading = this.createElement("div", "taskHeading", title);
		const taskDescription = this.createElement(
			"div",
			"taskDescription",
			description
		);

		taskWrapper.append(taskHeading);
		taskWrapper.append(taskDescription);

		const hr = this.createElement("hr");
		taskWrapper.append(hr);

		const label = this.createElement("label", ["completed", "form-check"]);
		taskWrapper.append(label);

		const input = this.createElement("input", "form-check-input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("data-item-id", itemId);
		label.append(input);

		const span = this.createElement("span");
		span.innerHTML = "Завершено?";
		label.append(span);

		const hr2 = this.createElement("hr");
		taskWrapper.append(hr2);

		const btn = this.createElement("button", [
			"btn",
			"btn-danger",
			"delete-btn",
		]);

		btn.setAttribute(`data-item-id`, itemId);
		btn.setAttribute("data-remove-btn", '');

		btn.innerHTML = "Удалить?";
		taskWrapper.append(btn);

		todoItem.querySelector("input[type=checkbox]").checked = completed;

		return todoItem;
	}

	renderItem(data) {
		this.#todoItemsContainer.prepend(
			this._createTemplate(data)
		)
	}

	removeTodoItem(id) {
		const todoItem = this.#todoItemsContainer.querySelector(`[data-todo-item-${id}]`);
		console.log(todoItem)

		todoItem.remove();
	}

	removeAllTodos() {
		this.#todoItemsContainer.innerHTML = '';
	}
}