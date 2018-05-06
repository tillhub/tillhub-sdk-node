<a name="Auth"></a>

## Auth
Authenticate an app via different auth strategies

**Kind**: global class  

* [Auth](#Auth)
    * [.loginUsername(username, password)](#Auth+loginUsername)
    * [.loginServiceAccount(account, serviceAccount, token)](#Auth+loginServiceAccount)

<a name="Auth+loginUsername"></a>

### auth.loginUsername(username, password)
**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | the tillhub client account e-mail address |
| password | <code>String</code> | the password corresponding to the tillhub client account |

<a name="Auth+loginServiceAccount"></a>

### auth.loginServiceAccount(account, serviceAccount, token)
Authenticate as headless service account.

**Kind**: instance method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>String</code> | tillhub client account uuid |
| serviceAccount | <code>String</code> | name of service account (a type of user in the registered in the client account) |
| token | <code>String</code> | token string |

