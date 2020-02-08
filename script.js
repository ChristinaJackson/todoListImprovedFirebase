//-----------What would make it better---------//
//(X)put buttons behind inputs
//(X)strike through vs () (x)
//(X)don't add blank todo's
//()Add an error message when no input and Add todo clicked?
//(X)toggle all strike through AND checks checkbox
// ----> checkboxes not showing checked because of displayTodos
//(X)checkbox toggles complete..()and checks
//(X)Pressing enter also submits todo
//(X)click item to toggle vs selecting index num
//(X)edit button vs the change todo feature
//(X) save button adds todo to the list
//()make it pretty  
//  -- set the todos to = sizes, text wrapping for input
//()make it responsive
//()make it accessible --> 
//  ()--(form added - need more accessible elements)
//  ()--hidden element that tells you list is empty

let todoList = {
    todos: [],
    addTodo: function(todoText){
      this.todos.push({
        todoText: todoText,
        completed: false
    });
  },
    changeTodo: function(position, todoText){
      this.todos[position].todoText = todoText;
    },
    deleteTodo: function(position){
      this.todos.splice(position,1);
    },
    toggleCompleted: function(position){
      let todo = this.todos[position];
      todo.completed = !todo.completed;
    },
    toggleAll: function(){
      let totalTodos = this.todos.length;
      let completedTodos = 0;
      this.todos.forEach(function(todo){
        if(todo.completed === true){
          completedTodos++;
        };
      });
      this.todos.forEach(function(todo){
        if( completedTodos === totalTodos){
          todo.completed = false;
        }else {
          todo.completed = true;
        }
      });
    } 
  };
  
  //-----------------handlers-------------------//
  var handlers = {
    addTodo: function(){
      let addTodoTextInput = document.getElementById('addTodoTextInput');
      if(addTodoTextInput.value.trim().length != 0){
      todoList.addTodo(addTodoTextInput.value);
      addTodoTextInput.value ='';
      view.displayTodos();
      }else{
        //add a message to user to input todo??
      }
    },
     changeTodo: function(position){ 
      view.changeTodo(position);
    },
    saveTodo: function(position,todoText){
      view.saveTodo(position);
      view.displayTodos();
    },
    deleteTodo: function(position){
      todoList.deleteTodo(position);
      view.displayTodos();
    },
    toggleCompleted: function(position){
      todoList.toggleCompleted(position);
      view.displayTodos();
    },
    toggleAll: function(){
      todoList.toggleAll();
      view.displayTodos();
    }
  };
  
  
  //-------------------View------------------------//
  let view ={
    displayTodos: function(){
    let todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';
      todoList.todos.forEach(function(todo,position,checkbox){
        let todoLi = document.createElement('li');
        let todoP = document.createElement('p');
        let todoTextWithCompletion = "";
        let todoCheckbox = view.createCheckBox();
        if(todo.completed === true){
          todoTextWithCompletion = todo.todoText;
          todoCheckbox.checked = true;
          todoP.style.textDecoration = 'line-through';
        }else{
        todoTextWithCompletion = todo.todoText;
        }
        //builds the todo li element
        todoLi.id = position;
        todoLi.appendChild(todoCheckbox);
        todoLi.appendChild(todoP);
        todoP.textContent = todoTextWithCompletion;
        todoLi.appendChild(view.createEditButton());
      
        todoLi.appendChild(view.createDeleteButton());
        // todoLi.appendChild(view.createEditButton());
        todosUl.appendChild(todoLi);
      });
    },
    changeTodo: function(position){
      //selects element of the node list
      let liElement = document.getElementById(position);
      let checkboxElement = liElement.children[0];
      let pElement = liElement.children[1];
      //changes edit button to save button
      let editToSaveButton = liElement.children[2]
      editToSaveButton.textContent = 'Save';
      editToSaveButton.type = 'submit';
      editToSaveButton.className = 'saveButton';
      let tempInput = document.createElement('input');
      tempInput.type = "text";
      //puts the previous input in the input element for edit state
      tempInput.value = pElement.textContent;
      liElement.insertBefore(tempInput, pElement);
      //temp remove or hide checkbox while in edit state and old todo text
      // liElement.removeChild(checkboxElement);
      // console.log(liElement.children)
      checkboxElement.style.visibility = 'hidden';
      liElement.removeChild(pElement);
    },
    saveTodo: function(position){
      let liElement = document.getElementById(position);
      //gets new todo value
      let todoText = liElement.children[1].value;
      //selecting and removing the input from edit state back to todo state
      let tempInput = liElement.children[1];
      liElement.removeChild(tempInput);
      //add new todo back to list
      todoList.changeTodo(position,todoText);
    },
    createDeleteButton: function(){
      let deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'deleteButton';
      return deleteButton;
    },
    createEditButton: function(){
      let editButton = document.createElement('button');
      editButton.textContent = ' Edit ';
      editButton.className = 'editButton';
      return editButton;
    },
    createCheckBox: function(){
      let checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.className = 'checkBox';
      return checkBox;
    },
    //-------------event delegation-----------//
    setUpEventListeners: function(){
      // listener on the ul element for all buttons/events
      let todosUl = document.querySelector('ul');
      //listener on the form 
      let todoInputform = document.getElementById('todoInputForm');
  
      todoInputform.addEventListener('submit', function(e){
        //prevents form from refreshing the page to keep todos
        e.preventDefault();
        handlers.addTodo();
      })
      todosUl.addEventListener('click', function(e){
      let elementClicked = e.target;
      //li element id to int, allows for specific selection of list item
      let position = parseInt(elementClicked.parentNode.id);
      if (elementClicked.className === 'deleteButton'){
        handlers.deleteTodo(position);
      }else if (elementClicked.className === 'checkBox'){
        handlers.toggleCompleted(position);
      }else if(elementClicked.className === "editButton"){
        handlers.changeTodo(position);
      }else if(elementClicked.className === 'saveButton'){
       handlers.saveTodo(position);
      };
      });
    }
  };
  view.setUpEventListeners();
  
  
  