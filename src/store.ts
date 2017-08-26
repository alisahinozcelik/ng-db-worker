import { DB_MESSAGES, IGetMessage } from "./interfaces";
import { DbService } from "./db.service";

export class Store<T> {
	private ready: Promise<void>;

	constructor(
		private db: DbService,
		private name: string
	) {
		this.ready = this.db.sendMessage(DB_MESSAGES.CHECK_STORE, {name})
			.then(() => {})
			.catch(err => {
				console.error("Db Store is not available, check DbServiceFactory");
			});
	}

	public add(value: T): Promise<T> {
		return this.ready
			.then(() => this.db.sendMessage(DB_MESSAGES.ADD, {storeName: this.name, value}))
			.then(res => res.value);
	}

	public get(key: number | string, index?: string): Promise<T> {
		return this.ready
			.then(() => this.db.sendMessage<{value: T}, IGetMessage>(DB_MESSAGES.GET, {storeName: this.name, key, index}))
			.then(res => res.value);
	}

	public put(key: number | string, value: T, index?: string): Promise<T> {
		return this.ready
			.then(() => this.db.sendMessage(DB_MESSAGES.PUT, {storeName: this.name, value, index}))
			.then(res => res.value);
	}

	public getAll(): Promise<T[]> {
		return this.ready
			.then(() => this.db.sendMessage<{value: T[]}>(DB_MESSAGES.GET_ALL, {storeName: this.name}))
			.then(res => res.value);
	}
}
