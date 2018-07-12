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
<dt><a href="#Products">Products</a></dt>
<dd><p>Handle Tillhub Transactions from the v0 Model</p>
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
    * [.loginUsername(username, password)](#Auth+loginUsername)
    * [.loginServiceAccount(clientAccount, apiKey)](#Auth+loginServiceAccount)

<a name="Auth+loginUsername"></a>

### auth.loginUsername(username, password)
**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | the tillhub client account e-mail address |
| password | <code>String</code> | the password corresponding to the tillhub client account |

<a name="Auth+loginServiceAccount"></a>

### auth.loginServiceAccount(clientAccount, apiKey)
Authenticate as headless service account.

**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| clientAccount | <code>String</code> | tillhub client account uuid |
| apiKey | <code>String</code> | name of service account (a type of user in the registered in the client account) |

<a name="Products"></a>

## Products
Handle Tillhub Transactions from the v0 Model

**Kind**: global class  
<a name="Products+getAll"></a>

### products.getAll([queryOrCallback], [callback])
Get all products from client account.

**Kind**: instance method of [<code>Products</code>](#Products)  

| Param | Type | Description |
| --- | --- | --- |
| [queryOrCallback] | <code>Object</code> \| <code>function</code> | query for products with allowed paramaters, or specify an optional callback |
| [callback] | <code>function</code> | optional callback. If not specified, this function returns a promise |

