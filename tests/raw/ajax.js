const Model = require('../../src/model.js')
const HOST = 'http://localhost:8000/api/v1'

class User extends Model {

	get url() {
		return `${HOST}/user/`
	}

    parse(resp, options){
    	if (resp.hasOwnProperty('objects')){
    		if (resp.objects.length == 1) {
    			return resp.objects[0]
    		}
			if (resp.objects.length == 0) {
    			return null
    		} else {
    			throw new Error('Duplicate Users')
    		}
    	}else{
    		return resp
    	}
    }
		
}

var user = new User({
	username: 'frank',
	password: '12345',
	email_hash: '1111111',
	email: 'aa@aa.com',
	username_clean: 'frank',
	mobile: '17721070527',
	mobile_hash: '17721070527'
})

// user.save()
// 	.then(()=>{ return user.save({ mobile:'17711023333' }) })
	// .then(()=> user.delete())

new User({ id: 35})
	.fetch()
	.then((res)=>{ console.log(res) })

new User({ email: 'aa@aa.com' })
	.fetch()
	.then((res)=>{ console.log(res) })

new User({ email: 'aaa@aa.com' })
	.fetch()
	.then((res)=>{ console.log(res) })