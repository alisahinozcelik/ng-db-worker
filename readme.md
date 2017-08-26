# Angular Http Request Module

#### *__Usage:__*
 
`npm install ng-requester --save`

```typescript
import { RequesterModule } from 'ng-requester';

@NgModule({
	imports: [
		...
		RequesterModule
	], ...
})
export class AppModule {}
```

#### *__Usage:__*

```typescript
import { Requester, METHODS } from "ng-requester";

...
export class MyComponent {
	constructor(
		private req: Requester
	) {
			req.set({
					host: "http://host.com",
					url: "api/endpoint",
					method: METHODS.POST
				})
				.send()
				.toPromise(res => {
					console.log(res);
				});
	}
}
```

```typescript
import { Requester } from "ng-requester";

...
export class MyComponent {
	private baseRequest: Requester;

	constructor(
		private req: Requester
	) {
		this.baseRequest = req
			.set({
				host: "http://host.com"
			});
	}

	private submit(data) {
		this.baseRequest.post("endpoint", {body: data}).toPromise().then(console.log);
	}

	private anOtherMethod() {
		this.baseRequest.get("anotherendpoint").toPromise().then(console.log);
	}
}
```

#### *__Authorization Example:__*

```typescript
import { Requester, PreRequest } from "ng-requester";

	this.authorizedRequest = req
		.addOperator(
			new PreRequest(options => {
					options.headers = options.headers.append("Authorization", "Bearer " + token);
					return options;
			})
		);
	
	...

	this.authorizedRequest.get("somesecretdataendpoint").toPromise().then(console.log);
```

#### *__Note:__*
All status codes do not throw error by default (404, 500)
You have to define them as errors

```typescript
import { Requester, PostRequest, Error } from "ng-requester";

	const SERVER_ERROR = Symbol("SERVER ERROR");

	this.request = req
		.addOperator(
			new PostRequest<any>(response => {
				if (response.data.status >= 500) {
					throw new Error(SERVER_ERROR, response.data.body);
				}
				return response;
			})
		);
	
	...

	this.request.get("somesecretdataendpoint").toPromise().then(console.log);
```