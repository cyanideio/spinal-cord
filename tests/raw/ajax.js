const Model = require('../../src/model.js')

class User extends Model {

	get url() {
		return 'http://localhost:8000/api/v1/user/'
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
// 	// .then(()=> user.delete())

var _user = new User({id: 35})
// var _user = new User({email: 'aa@aa.com'})

_user.fetch().then(()=>{
	console.log(_user)
})
