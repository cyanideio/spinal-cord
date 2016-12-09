const Model = require('../../src/model.js')

class User extends Model {

	get url() {
		return 'http://10.0.20.105:8000/api/v1/user/'
	}

	get defaults() {
		return {
			is_admin: false
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

try {
	user.save().catch(e => console.log(e))
} catch(e) {
	console.log(e);
}

