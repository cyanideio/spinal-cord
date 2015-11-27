import {Model, View, Collection, Router, FetchFile} from './src/exo.js';
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
            completed: ''
        };
    }
}

class Todos extends Collection {
    get model() {
        return Todo;
    }
    get url() {
        return '/api/todo/';
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

class TodosView extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(document.getElementById('todos_template').innerHTML);
        this.collection.addListener('changed', this.render.bind(this));
    }
    get events() {
        return {
            "change .completed_checkbox": this.todo_completed.bind(this)
        };
    }
    todo_completed(event) {
        var id = event.target.dataset.id;
        console.log(id);
    }
    render() {
        var render_data = {
            entries: this.collection.serialize()
        };
        this.element.innerHTML = this.template(render_data);
    }
}

(function() {
    console.log("DOM CONTENT LOADED");
    // var model = new Todo();
    // var view = new TodoView({
    //     model: model
    // });
    // var body = document.getElementsByTagName('body')[0];
    // body.appendChild(view.element);
    // view.render();

    var collection = new Todos();
    var todos_view = new TodosView({
        collection: collection
    });

    document.getElementsByTagName('body')[0].appendChild(todos_view.element);
    todos_view.render();

    collection.fetch(() => {
        console.log(collection.serialize());
    });
})();
