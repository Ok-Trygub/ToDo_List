"use strict";

const view = {
  controller: null,
  formId: null,
  form: null,
  todoContainerId: null,
  todoContainer: null,
  currentItemId: null,
  removeAllBtn: null,

  getObjKeyValues(formId, containerId) {
    if (!formId) throw new Error("No formId!");
    if (!containerId) throw new Error("No containerId!");

    this.formId = formId;
    this.containerId = containerId;

    this.form = document.getElementById(formId);
    if (this.form.nodeName !== "FORM")
      throw new Error("There is no such form on the page");

    this.todoContainer = document.getElementById(containerId);
  },

  getRemoveAllBtn() {
    this.removeAllBtn = this.form.querySelector(".remove-all");
  },

  setEvents() {
    this.form.addEventListener("submit", this.formHandler.bind(this));

    document.addEventListener("DOMContentLoaded", this.prefillForm.bind(this));

    this.todoContainer.addEventListener("click", this.removeElement.bind(this));

    this.removeAllBtn.addEventListener("click", this.removeAllTodos.bind(this));

    this.todoContainer.addEventListener("change", this.checkTodoItem.bind(this));
  },

  prefillForm() {
    const data = this.controller.getData(this.formId);

    if (!data || !data.length) return;

    data.forEach((item) => {
      this.todoContainer.prepend(this.createTemplate(item));
    });
  },

  formHandler(event) {
    event.preventDefault();
    ++this.currentItemId;

    let data = {
      id: this.formId,
      completed: false,
      itemId: this.currentItemId,

      ...this.findInputs(),
    };

    this.controller.saveData(data);

    this.todoContainer.append(this.createTemplate(data));

    event.target.reset();
  },

  createTemplate({ title, description, itemId, completed }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("col-4");

    let wrapInnerContent = '<div class="taskWrapper">';
    wrapInnerContent += `<div class="taskHeading">${title}</div>`;
    wrapInnerContent += `<div class="taskDescription">${description}</div>`;

    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<label class="completed form-check">`;

    wrapInnerContent += `<input data-item-id="${itemId}" type="checkbox" class="form-check-input" >`;
    wrapInnerContent += `<span>Завершено ?</span>`;
    wrapInnerContent += `</label>`;

    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<button class="btn btn-danger delete-btn" data-item-id="${itemId}">Удалить</button>`;

    wrapInnerContent += "</div>";

    wrapper.innerHTML = wrapInnerContent;

    wrapper.querySelector("input[type=checkbox]").checked = completed;

    return wrapper;
  },

  checkTodoItem({ target }) {
    const itemId = target.getAttribute("data-item-id");
    const status = target.checked;

    this.controller.changeCompleted(itemId, this.formId, status);
  },

  removeElement({ target }) {

    if (!target.classList.contains("delete-btn")) return;

    this.controller.removeItem(
      this.formId,
      target.getAttribute("data-item-id")
    );

    target.closest(".taskWrapper").parentElement.remove();
  },

  removeAllTodos() {
    this.controller.removeAll(this.formId);
    this.todoContainer.innerHTML = "";
  },

  findInputs() {
    return Array.from(
      this.form.querySelectorAll("input[type=text], textarea")
    ).reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
  },

  init(controllerInstance) {
    this.getObjKeyValues("todoForm", "todoItems");
    this.getRemoveAllBtn();
    this.setEvents();

    this.controller = controllerInstance;
  },
};
