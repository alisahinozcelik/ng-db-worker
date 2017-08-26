export function response(oldEvent, newData = {}) {
	postMessage(Object.assign(oldEvent.data, {success: true}, newData));
}

export function error(oldEvent, newData = {}) {
	postMessage(Object.assign(oldEvent.data, {success: false}, newData));
}

export class OpenPromise<T> {
	private _resolver: (param: T) => void;
	private _rejector: (error: any) => void;
	public promise: Promise<T>;

	public resolved = false;
	public rejected = false;

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this._resolver = resolve;
			this._rejector = reject;
		});
	}

	get finished(): boolean {
		return this.resolved || this.rejected;
	}

	public resolve(param: T): void {
		this.resolved = true;
		this._resolver(param);
	}

	public reject(error: any): void {
		this.rejected = true;
		this._rejector(error);
	}
}
