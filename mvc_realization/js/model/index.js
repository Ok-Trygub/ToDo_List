'use strict';

const model = {
  controller: null,

  setData(data) {
    const dbKey = data.id;
    delete data.id;

    if (!localStorage[dbKey]) {
      return localStorage.setItem(dbKey, JSON.stringify([data]));
    }

    let existingData = JSON.parse(localStorage.getItem(dbKey));
    existingData.push(data);

    localStorage.setItem(dbKey, JSON.stringify(existingData));
  },

  getData(dbKey) {
    return JSON.parse(localStorage.getItem(dbKey));
  },

  removeItem(dbKey, itemId) {
    const data = JSON.parse(localStorage.getItem(dbKey));
    const currentItemIndex = data.findIndex(
      (todoItem) => todoItem.itemId === +itemId
    );

    data.splice(currentItemIndex, 1);

    localStorage.setItem(dbKey, JSON.stringify(data));
  },

  changeCompleted(itemId, dbKey, status) {
    const data = JSON.parse(localStorage.getItem(dbKey));
    const currentItem = data.find((todoItem) => todoItem.itemId === +itemId);

    currentItem.completed = status;

    localStorage.setItem(dbKey, JSON.stringify(data));
  },

  clearStorage(dbKey) {
    localStorage.removeItem(dbKey);
  },

  init(controllerInstance) {
    this.controller = controllerInstance;
  },
};
