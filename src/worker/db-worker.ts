/// <reference path="../index.d.ts" />

import { IOpenDBMessageData, DB_MESSAGES, IGetMessage } from "../interfaces";
import { TransAction } from "./transaction";
import { error, response, OpenPromise } from "./helpers";

const dbOpened = new OpenPromise();
const transactions: {[key: string]: TransAction} = {};

onmessage = e => {
	switch (e.data.message as DB_MESSAGES) {
		case DB_MESSAGES.OPEN:
			const { name, version, callback, storeNames } = e.data as IOpenDBMessageData;
			openDB({name, version, callback, storeNames})
				.then(() => {
					response(e);
				})
				.catch(err => {
					error(e, err);
				});
			break;
		case DB_MESSAGES.CHECK_STORE:
			dbOpened.promise.then(() => {
				if (e.data.name in transactions) {
					response(e);
				} else {
					error(e);
				}
			});
			break;
		case DB_MESSAGES.GET:
			const { storeName, index, key } = e.data as IGetMessage;
			transactions[storeName].get(key, index)
				.then(value => { response(e, {value}); })
				.catch(err => { error(e, err); });
			break;
		case DB_MESSAGES.ADD:
			transactions[e.data.storeName].add(e.data.value)
				.then(() => { response(e); })
				.catch(err => { error(e, err); });
			break;
		case DB_MESSAGES.PUT:
			transactions[e.data.storeName].put(e.data.key, e.data.value, e.data.index)
			.then(() => { response(e); })
			.catch(err => { error(e, err); });
			break;
		case DB_MESSAGES.GET_ALL:
			transactions[e.data.storeName].getAll()
			.then(value => { response(e, {value}); })
			.catch(err => { error(e, err); });
			break;
		default:
			console.error("The message is not defined: ", e.data.message);
	}
};

function openDB({name, version, callback, storeNames}: IOpenDBMessageData) {
	const dbOpenReq = indexedDB.open(name, version);

	dbOpenReq.onupgradeneeded = function({target: {result: db}}) {
		let cb;
		eval("cb = " + callback);
		try {
			cb.call(this, db);
		} catch (err) {
			console.info(`onUpgradeNeeded callback function is passed as string to the web worker.
											It seems like there are variables which has been defined out of the callback function.
											Make the function isolated and try again`);
			console.error(err);
			dbOpened.reject(err);
		}
	};

	dbOpenReq.onsuccess = ({target: {result: db}}) => {
		storeNames.forEach(name => {
			transactions[name] = new TransAction(db, name);
		});
		dbOpened.resolve(db);
	};

	dbOpenReq.onblocked = dbOpened.reject;
	dbOpenReq.onerror = dbOpened.reject;

	return dbOpened.promise;
}

