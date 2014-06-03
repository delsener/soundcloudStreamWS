$(function () {

// -- Backbone: view model for todos
var Todo = Backbone.Model.extend({
    defaults: {
    	id:	null,
        title: 'title',
        description: 'description',
        estimation: 8, // range: 1,2,3,5,8
        assignee: 'unassigned',
        state: 1 // 1 = todo, 2 = in progress, 3 = done
    }
});

// -- Backbone: collection of Todo view models
var TodoList = Backbone.Collection.extend({
    model: Todo,
    url: '/todos', // see todo routes

    listTodo: function () {
    	return this.where({state: 1});
    },
    
    listInProgress: function () {
    	return this.where({state: 2});
    },

    listDone: function () {
    	return this.where({state: 3});
    }
});

// -- Backbone: view of a single Todo object with editing support
var TodoView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#input-template').html()),


        events: {
            'click #next-state-button': 'nextState',
            'click #edit-button': 'editMode',
            'click #save-button': 'save',
        },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.title = this.$('#input-title');
        this.description = this.$('#input-description');
        this.estimation = this.$('#input-estimation');
        this.assignee = this.$('#input-assignee');
        return this;
    },
    
    editMode: function() {
    	 this.$el.addClass("editing-mode");
         this.title.focus()
    },
    
    save: function() {
    	this.$el.removeClass("editing-mode");
    	this.model.save({
    		title: this.title.val(),
    		description: this.description.val(),
    		estimation: this.estimation.val(),
    		assignee: this.assignee.val(),
    	});
    },
    
    nextState: function(){
        var value = (this.model.attributes.state % 3) + 1;
        console.log(value);
        this.model.save({state: value}, {async: false, sync: true, reset: true});
        this.model.trigger('reload');

    },

    toLeft: function(){
        var value = this.model.attributes.state - 1;
        console.log(value);
        this.model.save({state: value}, {async: false, sync: true, reset: true});
        this.model.trigger('reload');

    },
    
    toRight: function(){
    	var value = this.model.attributes.state + 1;
    	console.log(value);
        this.model.save({state: value}, {async: false, sync: true, reset: true});
        this.model.trigger('reload');

    }
});


// main view
var TodoApp = Backbone.View.extend({
    el: $('#mainView'),

    events: {
        'click #create-button': 'createTodo',
        'click #delete-button': 'deleteTodo'


    },

    initialize: function () {
        this.todos = new TodoList();
        this.title = $('#title');
        this.description = $('#description');
        this.estimation = $('#estimation');
        this.assignee = $('#assignee');
        this.listTodo = $('#listTodo');
        this.listInProgress = $('#listInProgress');
        this.listDone = $('#listDone');
        
        this.listenTo(this.todos, 'add', this.addItem);
        this.listenTo(this.todos, 'all', this.render);
        this.listenTo(this.todos, 'reload', this.reload);
        
        this.reload();
    },

    deleteTodo: function(item){
        this.todos._byId[(item.toElement.attributes.getNamedItem("data-id").value)].destroy({async: false, sync: true, reset: true});
        this.reload()
    },
    
    createTodo: function () {
    	console.log("createItem");
        var item = this.todos.create({ 
        	title: this.title.val(), 
        	description: this.description.val(), 
        	estimation: this.estimation.val(), 
        	assignee: this.assignee.val()
        });
        console.log("created " + item);
        this.title.val('example title');
        this.description.val('example description');
        this.estimation.val('8');
        this.assignee.val('example assignee');
        
        this.reload();
    },
    
    addItem: function (item) {
    	console.log("addingItem");
        var todoView = new TodoView({ model: item });
        if(item.attributes.state == 1){
            this.listTodo.append(todoView.render().el);

        } else if(item.attributes.state == 2){
            this.listInProgress.append(todoView.render().el);
        } else if(item.attributes.state == 3){
            this.listDone.append(todoView.render().el);
        }
    },

    reload: function () {
        this.listTodo.empty(); 
        this.listInProgress.empty();
        this.listDone.empty();
        
        this.todos.fetch();
    	this.todos.each(this.addItem, this);
    }

    });

    var todoApp = new TodoApp();
});
