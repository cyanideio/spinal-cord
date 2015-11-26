import {Model, View} from './src/exo.js';
// import {Handlebars} from './bower_components/handlebars/handlebars.js';

class Todo extends Model {
    get url() {
        return '/api/todo/';
    }
    get defaults() {
        return {
            name: '',
            description: '',
            created: '',
            updated: ''
        };
    }
}

class TodoView extends View {
    constructor(options) {
        super(options);
        this.model.addListener('change', this.render.bind(this));
        this.template = Handlebars.compile('Name: <input id="name" type="text" value="{{name}}" /><br>Description: <input id="description" type="text" value="{{description}}" /><br><button id="save">Save</button>');
        console.log(this.template);
    }
    save(event) {
        var data = {
            name: this.element.querySelector('#name').value,
            description: this.element.querySelector('#description').value
        };
        console.log(data);
        this.model.save(data, (response) => {
            console.log("Model Save: ", response);
        });
    }
    get events() {
        return {
            "click #save": this.save.bind(this)
        }
    }
    render() {
        var rendered = this.template(this.model.serialize());
        this.element.innerHTML = rendered;
        return this;
    }
}

(function() {
    console.log("DOM CONTENT LOADED");
    var model = new Todo();
    var view = new TodoView({
        model: model
    });
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(view.element);
    view.render();
})();
