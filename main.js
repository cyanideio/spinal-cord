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
        this.template = Handlebars.compile(document.getElementById('todo_template').innerHTML);
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
            "click .todo_save": this.save.bind(this)
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
            "change .completed_checkbox": this.todo_completed.bind(this),
            "click .edit_todo": this.edit_todo.bind(this),
            "click .delete_todo": this.delete_todo.bind(this),
            "click .create_button": this.create_todo.bind(this)
        };
    }
    create_todo() {
        console.log("Create TODO");
        var view = new TodoView({
            model: new Todo()
        });
        var container = this.element.querySelector('#edit_todo_container');
        container.innerHTML = '';
        container.appendChild(view.element);
        view.render();
    }
    edit_todo(event) {
        var id = event.target.dataset.id;
        var model = this.collection.get(id);
        console.log("Edit TODO: ", id, model);
        var view = new TodoView({
            model: model
        });
        var container = this.element.querySelector('#edit_todo_container');
        container.innerHTML = '';
        container.appendChild(view.element);
        view.render();
    }
    delete_todo(event) {
        var id = event.target.dataset.id;
        var model = this.collection.get(id);
        console.log("Delete TODO: ", id, model);
    }
    todo_completed(event) {
        var id = event.target.dataset.id;
        var model = this.collection.get(id);
        console.log("Complete TODO: ", id, model);
    }
    render() {
        var render_data = {
            entries: this.collection.serialize()
        };
        this.element.innerHTML = this.template(render_data);
    }
}

(function() {
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
