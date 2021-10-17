import { emptyItemQuery } from './item.js';

export default class Store {

	constructor(name, callback) {

		let liveTodos;  // list of todos objects

		this.getLocalStorage = () => {
			// Fetches the todos from the localstorage
			return liveTodos || JSON.parse(localStorage.getItem(name) || []);
		};

		this.setLocalStorage = (todos) => {
			localStorage.setItem(name, JSON.stringify(liveTodos = todos));
		};

		if (callback) {
			callback();
		}
	}

	find(query, callback) {
		const todos = this.getLocalStorage();

		callback(todos.filter(todo => {
			for (let k in query) {
				if (query[k] !== todo[k]) {
					return false;
				}
			}
			return true;
		}));
	}

	update(update, callback) {
		const id = update.id;
		const todos = this.getLocalStorage();
		let i = todos.length;

		while (i--) {
			if (todos[i].id === id) {
				for (let k in update) {
					todos[i][k] = update[k];
				}
				break;
			}
		}

		this.setLocalStorage(todos);

		if (callback) {
			callback();
		}
	}

	insert(item, callback) {
		
		const todos = this.getLocalStorage();

		// Loop over the todos list and check if there are any existing todo object with the item's title
		const found = todos.find(element => element.title === item.title);

		// If no object with item's title fouund, the item will be added to the todos and saved in the local storage
		if(found === undefined){
			todos.push(item);

			this.setLocalStorage(todos);

			if (callback) {
				callback();
			}
		}
		else {
			alert("To-do already exist");
		}
	}

	remove(query, callback) {
		// todo
		const todos = this.getLocalStorage().filter(todo => {
			for (let k in query) {
				if (query[k] === todo[k]) {
					return true;
				}
			}
			return false;
		});

		this.setLocalStorage(todos);

		if (callback) {
			callback(todos);
		}
	}

	count(callback) {
		this.find(emptyItemQuery, data => {
			const total = data.length;

			let i = total;
			let completed = 0;

			while (i--) {
				completed += data[i].completed;
			}
			callback(total, total - completed, completed);
		});
	}
}
