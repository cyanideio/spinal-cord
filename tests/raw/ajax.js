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
	password: '12345'
})

try {
	user.save()
} catch(e) {
	console.log(e);
}

