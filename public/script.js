//-----------What would make it better---------//
//(X)put buttons behind inputs
//(X)strike through vs () (x)
//(X)don't add blank todo's
//()Add an error message when no input and Add todo clicked?
//(X)toggle all strike through AND checks checkbox
// ----> checkboxes not showing checked because of displayTodos
//(X)checkbox toggles complete.(X)and checks
//(X)Pressing enter also submits todo
//(X)click item to toggle vs selecting index num
//(X)edit button vs the change todo feature
//(X) save button adds todo to the list
//(X)make it pretty  
//  -- set the todos to = sizes, text wrapping for input
//(X)make it responsive
//()make it accessible -->
//(X) Checkboxes need <label>
//  ()--(form added - need more accessible elements)
//  ()--hidden element that tells you list is empty

var firebaseConfig = {
  apiKey: "AIzaSyAVF46wp0uDh8l7uB2tWBAeJRBob0dudVc",
  authDomain: "todolistimproved.firebaseapp.com",
  databaseURL: "https://todolistimproved.firebaseio.com",
  projectId: "todolistimproved",
  storageBucket: "todolistimproved.appspot.com",
  messagingSenderId: "722028871004",
  appId: "1:722028871004:web:b276076b6694fe0d22d599",
  measurementId: "G-58V0BMSNB1"
};

// Initialize Firebase and database
firebase.initializeApp(firebaseConfig);


window.onload = function () {
  view.setUpEventListeners();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user !== null) {
      let currentUser = user.uid;
      getTodos(currentUser);
      return database = firebase.database().ref(`${user.uid}`);
    } else {
      console.log(user)
      window.location = 'loginpage.html'
    }
  })
}

//displays previously stored todo items, if any
async function getTodos(currentUser) {
  let previousTodos = await firebase.database().ref(`${currentUser}`).once("value")
    .then(function (snapshot) {
      let pastTodos = snapshot.val();
      if (pastTodos !== null) {
        todoList.todos = pastTodos;
        view.displayTodos();
      }
    });
};


function handleSignOut() {
  firebase.auth().signOut().then(function () {
    console.log('signed out')
    window.location = 'loginpage.html'
  }).catch(function (error) {
    console.log('error: ' + error)
  });
}


let todoList = {
  todos: [],
  addTodo: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    })
  },
  changeTodo: function (position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function (position) {
    this.todos.splice(position, 1);

  },
  toggleCompleted: function (position) {
    let todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function () {
    let totalTodos = this.todos.length;
    let completedTodos = 0;
    this.todos.forEach(function (todo) {
      if (todo.completed === true) {
        completedTodos++;
      };
    });
    this.todos.forEach(function (todo) {
      if (completedTodos === totalTodos) {
        todo.completed = false;
      } else {
        todo.completed = true;
      }
    });
  },
};

//-----------------handlers/controller-------------------//
var handlers = {
  addTodo: function () {
    let addTodoTextInput = document.getElementById('addTodoTextInput');
    let noTodos = document.getElementById('noTodos')

    if (addTodoTextInput.value.trim().length !== 0) {
      todoList.addTodo(addTodoTextInput.value);
      addTodoTextInput.value = '';
      // noTodos.style.display ='none';
      view.displayTodos();
    } else {
      //add a message to user to input todo
    }
  },
  changeTodo: function (position) {
    view.changeTodo(position);
  },
  saveTodo: function (position, todoText) {
    view.saveTodo(position);
    view.displayTodos();
  },
  deleteTodo: function (position) {
    if (todoList.todos.length === 1) {
      todoList.deleteTodo(position);
      //clears the database if element deleted is last item on the list    
      database.remove()
      noTodos.style.display = 'block'
    } else {
      todoList.deleteTodo(position);
    }
    view.displayTodos();
  },
  toggleCompleted: function (position) {
    todoList.toggleCompleted(position);
    view.displayTodos();
  },
  toggleAll: function () {
    todoList.toggleAll();
    view.displayTodos();
  }
};


//-------------------View------------------------//
let view = {
  displayTodos: function () {
    let todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';
    todoList.todos.forEach(function (todo, position, checkbox) {
      let todoLi = document.createElement('li');
      let todoP = document.createElement('p');
      let todoTextWithCompletion = "";
      let todoCheckbox = view.createCheckBox();
      //set database to match todo list
      database.set(todoList.todos);

      //labeling the checkbox for what item on the this - accessibility
      let checkBoxLabel = document.createElement('label')
      checkBoxLabel.textContent = 'Todo item';
      checkBoxLabel.className = 'visually-hidden';
      todoCheckbox.appendChild(checkBoxLabel)
      checkBoxLabel.htmlFor = `item: ${todo.todoText}`

      //adds a strike through if the todo is complete
      if (todo.completed === true) {
        todoTextWithCompletion = todo.todoText;
        todoCheckbox.checked = true;
        todoP.style.textDecoration = 'line-through';
      } else {
        todoTextWithCompletion = todo.todoText;
      }
      //builds the todo li element with all features
      todoLi.id = position;
      todoLi.appendChild(todoCheckbox);
      todoLi.appendChild(todoP);
      todoP.textContent = todoTextWithCompletion;
      todoLi.appendChild(view.createEditButton());
      todoLi.appendChild(view.createDeleteButton());
      todosUl.appendChild(todoLi);
    });
  },
  changeTodo: function (position) {
    //selecting elements of the node list
    let liElement = document.getElementById(position);
    let checkboxElement = liElement.children[0];
    let pElement = liElement.children[1];

    //changes edit button to save button
    let editToSaveButton = liElement.children[2]
    editToSaveButton.textContent = 'Save';
    editToSaveButton.className = 'saveButton';
    let tempInput = document.createElement('input');
    tempInput.type = "text";
    tempInput.className = 'tempInput'
    //puts the previous input in the input element for edit state
    tempInput.value = pElement.textContent;
    liElement.insertBefore(tempInput, pElement);
    //temp hide checkbox while in edit state and old todo text
    checkboxElement.style.visibility = 'hidden';
    liElement.removeChild(pElement);
  },
  saveTodo: function (position) {
    let liElement = document.getElementById(position);
    //gets new todo value
    let todoText = liElement.children[1].value;
    //selecting and removing the input from edit state back to todo state
    let tempInput = liElement.children[1];
    liElement.removeChild(tempInput);
    //add new todo back to list
    todoList.changeTodo(position, todoText);
  },
  createDeleteButton: function () {
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  createEditButton: function () {
    let editButton = document.createElement('button');
    editButton.textContent = ' Edit ';
    editButton.className = 'editButton';
    return editButton;
  },
  createCheckBox: function () {
    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'checkBox';
    return checkBox;
  },

  //-------------event delegation-----------//
  setUpEventListeners: function () {
    // listener on the ul element for all buttons/events and form
    let todosUl = document.querySelector('ul');
    let todoInputform = document.getElementById('todoInputForm');
    let signOutButton = document.getElementById('signOut');

    todoInputform.addEventListener('submit', function (e) {
      //prevents form from refreshing the page to keep todos
      e.preventDefault();
      handlers.addTodo();
    }),
      todoInputform.addEventListener('click', function (e) {
        if (e.target.className === 'toggleAll') {
          handlers.toggleAll();
        }
      }),
      todosUl.addEventListener('click', function (e) {
        let elementClicked = e.target;
        //li element id to int, allows for specific selection of list item
        let position = parseInt(elementClicked.parentNode.id);
        if (elementClicked.className === 'deleteButton') {
          handlers.deleteTodo(position);
        } else if (elementClicked.className === 'checkBox') {
          handlers.toggleCompleted(position);
        } else if (elementClicked.className === "editButton") {
          handlers.changeTodo(position);
        } else if (elementClicked.className === 'saveButton') {
          handlers.saveTodo(position);
        };
      });
    signOutButton.addEventListener('click', handleSignOut);
  }

};


