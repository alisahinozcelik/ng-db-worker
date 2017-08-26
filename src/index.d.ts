declare var require: any

interface IDBVersionChangeEventTarget extends EventTarget {
	result: IDBDatabase;
}

declare interface IDBVersionChangeEvent {
	target: IDBVersionChangeEventTarget;
}

declare interface IDBOpenDBRequest {
	onsuccess: (event: IDBVersionChangeEvent) => any;
}

declare function postMessage(message: any): void;