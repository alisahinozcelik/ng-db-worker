import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { uniqueId } from "lodash";

const script: string = require("./worker").default;
import { IWorkerMessageResponse, DB_MESSAGES, IObject, IWorkerMessage, IOpenDBMessageData } from "./interfaces";
import { Store } from "./store";

@Injectable()
export class DbService {
	private dbWorker: Worker;
	private workerMessages: Observable<IWorkerMessageResponse>;
	public dbReady: Promise<any>;

	constructor(
		name: string,
		version: number,
		onUpgradeNeededCallback: (db: IDBDatabase) => void,
		storeNames: string[]
	) {
		const blob = new Blob([script], {type: "application/javascript"});
		this.dbWorker = new Worker(URL.createObjectURL(blob));

		this.workerMessages = new Observable<IWorkerMessageResponse>(observer => {
			this.dbWorker.onmessage = e => {
				observer.next(e.data);
			};
		});

		this.dbReady = this.sendMessage<{}, IOpenDBMessageData>(DB_MESSAGES.OPEN, {
			version,
			storeNames,
			name,
			callback: onUpgradeNeededCallback.toString()
		});
	}

	/* tslint:disable */
	public sendMessage<T extends IObject = {}, U extends IObject = {}>(
		message: DB_MESSAGES,
		data: U = {} as U
	): Promise<IWorkerMessageResponse & T & U> {

		const id = uniqueId("__ndw_mid__");
		const messageObject: IWorkerMessage & IObject = Object.assign(data, {__ndw_mid__: id, message})
		this.dbWorker.postMessage(messageObject);

		return this.workerMessages
			.filter(message => message.__ndw_mid__ === id)
			.first()
			.toPromise()
			.then((res: IWorkerMessageResponse & T & U) => {
				if (!res.success) { throw res; }
				return res;
			});
	}

	public getStore<T>(name: string): Store<T> {
		return new Store<T>(this, name);
	}
	/* tslint:enable */
}
