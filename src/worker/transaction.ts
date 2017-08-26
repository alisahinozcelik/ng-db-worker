import { IDBRequestEvent } from "../interfaces";

export class TransAction {
	constructor(
		private db: IDBDatabase,
		private storeName: string
	) {}

	public add(value: any) {
		return this.generator("add", [value]);
	}

	public getAll() {
		return this.generator("getAll", []);
	}

	generator(method, args) {
		const transAction =  this.db.transaction([this.storeName], "readwrite");
		const store = transAction.objectStore(this.storeName);

		return new Promise((resolve, reject) => {
			const action = store[method](...args);

			action.onsuccess = e => {
				resolve(e.target.result);
			};

			action.onerror = reject;
		});
	}

	public get(key: string | number, index?: string): Promise<any> {
		const { db, storeName } = this;
		const transaction = db.transaction([storeName], "readonly");
		let store = transaction.objectStore(storeName);

		return new Promise((resolve, reject) => {
			if (index) {
				store = store.index(index).objectStore;
			}

			const action = store.get(key);

			action.onsuccess = (e: IDBRequestEvent) => {
				resolve(e.target.result);
			};
			action.onerror = reject;
		});
	}

	put(key: string | number, value: any, index?: string) {
		const { db, storeName } = this;
		const transaction = db.transaction([storeName], "readwrite");
		let store = transaction.objectStore(storeName);

		return new Promise((resolve, reject) => {
			if (index) {
				store = store.index(index).objectStore;
			}

			const getAction = store.get(key);

			getAction.onsuccess = (e: IDBRequestEvent) => {
				const putAction = store.put(value);

				putAction.onsuccess = (e: IDBRequestEvent) => {
					resolve(e.target.result);
				};
				putAction.onerror = reject;
			};
			getAction.onerror = reject;
		});
	}
}
