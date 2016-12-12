```
               _             __                          __
   _________  (_)___  ____ _/ /     _________  _________/ /
  / ___/ __ \/ / __ \/ __ `/ /_____/ ___/ __ \/ ___/ __  / 
 (__  ) /_/ / / / / / /_/ / /_____/ /__/ /_/ / /  / /_/ /  
/____/ .___/_/_/ /_/\__,_/_/      \___/\____/_/   \__,_/   
    /_/                                                    
```
[![Build Status](https://travis-ci.org/cyanideio/spinal-cord.svg?branch=master)](https://travis-ci.org/cyanideio/spinal-cord) [![Coverage Status](https://coveralls.io/repos/github/cyanideio/spinal-cord/badge.svg?branch=master)](https://coveralls.io/github/cyanideio/spinal-cord?branch=master)
# Spinal-Cord
## Overview
This project is inspired by __backbone.js__'s data layer, i.e __Collections__ and __Models__. 
It allows users to manipulate data objects with classical __backbone.js__ style syntax, on both frontend and backend.

## Backends
On the spinal-cord roadmap. We plan to support different backends as data store. Including:
- Restful API (Server Side & Client Side)
- IndexDB (In the browser)
- LocalStorage (KVDB in Browser)
- Redis (KVDB on Server)

## Examples
```javascript
'use strict'
const RestfulModel = require('spinal-cord').RestfulModel

class User extends RestfulModel {

  get resource_name() {
    return 'user'
  }

  get host() {
    return 'http://your-nice-server.com'
  }

  parse(resp, options){
    if (resp.constructor.name === 'Array'){
      return resp.length ? resp[0] : null
    } else {
      return resp
    }
  }
}

var user0 = new User({ "email": "yaame.zhu_1@cyanide.io" })
var user1 = new User({ "mobile": "13394058373" })
var user2 = new User({ "email": "yaame.zhu@cyanide.io" })
user0.get()
.then((res)=>{ return user0.delete() })
.then((res)=>{ return user1.get() })
.then((res)=>{ return user1.delete() })
.then((res)=>{ return user2.get() })
.then((res)=>{ return user2.delete() })

let user = new User({ "email": "yaame.zhu@cyanide.io" })
user.get()
.then(res =>{ return user.save({ "email": "yaame.zhu_1@cyanide.io" }) })
.then((res)=>{ 
	// do your stuff here
}) 

```

# Change Log
Please Refer to https://github.com/cyanideio/spinal-cord/releases
