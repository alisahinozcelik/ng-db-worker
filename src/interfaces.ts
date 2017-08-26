export enum DB_MESSAGES {
	OPEN,
	CHECK_STORE,
	GET,
	ADD,
	PUT,
	GET_ALL
}

export interface IWorkerMessage {
	message: DB_MESSAGES;
}

export interface IWorkerMessageResponse {
	success: boolean;
}

export interface IObject {
	[key: string]: any;
}

export interface IUpgradeNeededMessage {
	upgradeNeeded: boolean;
}

export interface IDbConnectionIndex {
	index: string;
	unique: boolean;
}

export interface IDbConnectionOptions {
	name: string;
	keyPath: string;
	autoIncrement?: boolean;
	indexes?: IDbConnectionIndex[]
}

export interface IOpenDBMessageData {
	name: string;
	version: number;
	callback: string;
	storeNames: string[];
}

export interface IStoreMessage {
	storeName: string;
}

export interface IGetMessage extends IStoreMessage {
	key: string | number;
	index?: string;
}

export interface IDBRequestEventTarget extends EventTarget {
	result: any;
}

export interface IDBRequestEvent extends Event {
	target: IDBRequestEventTarget;
}
