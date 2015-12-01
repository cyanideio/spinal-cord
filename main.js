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
        var d = new Date();
        var iso_datetime = d.toISOString();
        var completed_checkbox_element = this.element.querySelector('.todo_completed');
        var completed = (completed_checkbox_element && this.element.querySelector('.todo_completed').checked) ? iso_datetime : null;
        var data = {
            name: this.element.querySelector('.todo_name').value,
            description: this.element.querySelector('.todo_description').value,
            completed: completed
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
        this.collection.addListener('change', this.render.bind(this));
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
        var new_todo = new Todo();
        new_todo.addOneTimeListener('saved', () => {
            console.log("Add model to collection: ", new_todo);
            this.collection.add(new_todo);
        });
        var view = new TodoView({
            model: new_todo
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
        model.delete();
        console.log("Delete TODO: ", id, model);
    }
    todo_completed(event) {
        var id = event.target.dataset.id;
        var model = this.collection.get(id);
        console.log("Complete TODO: ", id, model);
        var completed = null;
        if (model.completed === null) {
            var d = new Date();
            var iso_datetime = d.toISOString();
            completed = iso_datetime;
        }
        model.save({completed: completed}, () => {
            console.log("Completed Saved!");
        });
    }
    render() {
        console.log("Rendering TODOs");
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
