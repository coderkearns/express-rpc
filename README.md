# express-rpc

Easily make RPC (Remote Procedure Call) API interfaces with Express.

## Installation

There is not a npm package currently, so it must be installed with git:

```bash
$ npm install git+https://github.com/coderkearns/express-rpc
```

## Usage

express-rpc contains two possible versions: the basic version and the class based version.

### Basic

```js
const express = require('express');
const { basicRPC } = require('express-rpc');

const app = express();

let num = 0
app.use("/", basicRPC({
	num: {
		__index: () => [200, num],
		get: () => [200, num],
		increment: () => [200, ++num],
	}
}))

app.listen(process.env.PORT || 3000);
```
```bash
$ curl http://localhost:3000/num.get
0
$ curl http://localhost:3000/num.increment
1
$ curl http://localhost:3000/num.increment
2
$ curl http://localhost:3000/num.get
2
```

### Class

```js
const express = require('express');
const { classRPC } = require('express-rpc');

const app = express();

class NumRPC {
	constructor() {
		this.num = 0;
	}
	get() {
		return [200, this.num];
	}
	increment() {
		this.num++;
		return [200, this.num];
	}
}

app.use("/", classRPC({ num: NumRPC }))

app.listen(process.env.PORT || 3000);
```
```bash
$ curl http://localhost:3000/num.get
0
$ curl http://localhost:3000/num.increment
1
$ curl http://localhost:3000/num.increment
2
$ curl http://localhost:3000/num.get
2
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
