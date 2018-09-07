## Classes

<dl>
<dt><a href="#v0.Auth">v0.Auth</a></dt>
<dd></dd>
<dt><a href="#Transactions">Transactions</a></dt>
<dd><p>Handle Tillhub Transactions from the v0 Model</p>
</dd>
<dt><a href="#Auth">Auth</a> ⇐ <code>&quot;v0.Auth&quot;</code></dt>
<dd><p>Authenticate an app via different auth strategies</p>
</dd>
<dt><a href="#Carts">Carts</a></dt>
<dd><p>Handle Tillhub Carts from the v1 Model</p>
</dd>
<dt><a href="#Products">Products</a></dt>
<dd><p>Handle Tillhub Products from the v1 Model</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#authResponseStruct">authResponseStruct</a> : <code>Object</code></dt>
<dd><p>Object that is returned by all authentication methods.</p>
</dd>
<dt><a href="#authCallback">authCallback</a> : <code>function</code></dt>
<dd><p>Callback that will be passed by all authentication methods.</p>
</dd>
</dl>

<a name="v0.Auth"></a>

## v0.Auth
**Kind**: global class  
<a name="new_v0.Auth_new"></a>

### new v0.Auth()
Authenticate an app via different auth strategies

**Example**  
```js
const Auth = require('@tillhub/node-sdk').v0.Auth
const auth = new Auth ()

auth.loginUsername('user@example.com', '123455', (err, body) => {
  if (err) throw err
  console.log(body.token)
  console.log(body.user)
})
```
<a name="Transactions"></a>

## Transactions
Handle Tillhub Transactions from the v0 Model

**Kind**: global class  
<a name="Transactions+getAll"></a>

### transactions.getAll([queryOrCallback], [callback])
Get all transactions from client account.

**Kind**: instance method of [<code>Transactions</code>](#Transactions)  

| Param | Type | Description |
| --- | --- | --- |
| [queryOrCallback] | <code>Object</code> \| <code>function</code> | query for transactions with allowed paramaters, or specify an optional callback |
| [callback] | <code>function</code> | optional callback. If not specified, this function returns a promise |

<a name="Auth"></a>

## Auth ⇐ <code>&quot;v0.Auth&quot;</code>
Authenticate an app via different auth strategies

**Kind**: global class  
**Extends**: <code>&quot;v0.Auth&quot;</code>  

* [Auth](#Auth) ⇐ <code>&quot;v0.Auth&quot;</code>
    * [.loginUsername(username, password, [callback])](#Auth+loginUsername)
    * [.loginServiceAccount(clientAccount, apiKey, [callback])](#Auth+loginServiceAccount)

<a name="Auth+loginUsername"></a>

### auth.loginUsername(username, password, [callback])
Authenticate by username

**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | the tillhub client account e-mail address |
| password | <code>String</code> | the password corresponding to the tillhub client account\ |
| [callback] | [<code>authCallback</code>](#authCallback) | optional callback |

<a name="Auth+loginServiceAccount"></a>

### auth.loginServiceAccount(clientAccount, apiKey, [callback])
Authenticate as headless service account.

**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| clientAccount | <code>String</code> | tillhub client account uuid |
| apiKey | <code>String</code> | name of service account (a type of user in the registered in the client account) |
| [callback] | [<code>authCallback</code>](#authCallback) | optional callback |

<a name="Carts"></a>

## Carts
Handle Tillhub Carts from the v1 Model

**Kind**: global class  

* [Carts](#Carts)
    * [.getAll([queryOrCallback], [callback])](#Carts+getAll)
    * [.create(cart, [optionsOrCallback], [callback])](#Carts+create)

<a name="Carts+getAll"></a>

### carts.getAll([queryOrCallback], [callback])
Get all carts from client account.

**Kind**: instance method of [<code>Carts</code>](#Carts)  

| Param | Type | Description |
| --- | --- | --- |
| [queryOrCallback] | <code>Object</code> \| <code>function</code> | query for carts with allowed paramaters, or specify an optional callback |
| [callback] | <code>function</code> | optional callback. If not specified, this function returns a promise |

<a name="Carts+create"></a>

### carts.create(cart, [optionsOrCallback], [callback])
Create a cart to consume in Tillhub Clients.

**Kind**: instance method of [<code>Carts</code>](#Carts)  

| Param | Type | Description |
| --- | --- | --- |
| cart | <code>Object</code> | the cart body |
| [optionsOrCallback] | <code>Object</code> \| <code>function</code> | query for carts with allowed paramaters, or specify an optional callback |
| [callback] | <code>function</code> | optional callback. If not specified, this function returns a promise |

<a name="Products"></a>

## Products
Handle Tillhub Products from the v1 Model

**Kind**: global class  
<a name="Products+getAll"></a>

### products.getAll([queryOrCallback], [callback])
Get all products from client account.

**Kind**: instance method of [<code>Products</code>](#Products)  

| Param | Type | Description |
| --- | --- | --- |
| [queryOrCallback] | <code>Object</code> \| <code>function</code> | query for products with allowed paramaters, or specify an optional callback |
| [callback] | <code>function</code> | optional callback. If not specified, this function returns a promise |

<a name="authResponseStruct"></a>

## authResponseStruct : <code>Object</code>
Object that is returned by all authentication methods.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | JWT token that will be used as Bearer Token in subsequent requests |
| user | <code>boolean</code> | the alphanumeric client account ID that will be used in most routes |

<a name="authCallback"></a>

## authCallback : <code>function</code>
Callback that will be passed by all authentication methods.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| body | [<code>authResponseStruct</code>](#authResponseStruct) | 

