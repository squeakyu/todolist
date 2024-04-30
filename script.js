import { registerUser, loginUser, addTodo, removeTodo } from './database.js';

let currUserEmail = null;

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === '' || password === '') {
        alert('Invalid username or password. Please try again.');
    } else {
        try {
            const todos = await loginUser(username, password);
            currUserEmail = username;
            document.querySelector('.todo-container').style.display = 'block';
            document.querySelector('.register-container').style.display = 'none';
            document.querySelector('.login-container').style.display = 'none';
            displayTodos(todos); 
        } catch (error) {
            alert(error.message); 
        }
    }
});

document.getElementById('showRegisterForm').addEventListener('click', function() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.register-container').style.display = 'block';
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('usernameRegister').value;
    const password = document.getElementById('passwordRegister').value;
    const confirmPassword = document.getElementById('confirmPasswordRegister').value;

    if(username === '' || password === ''){
        alert('Invalid username of password. Please try again.');
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    try {
        await registerUser(email, password);
        alert("Registration successful, you can now login.");
        document.querySelector('.register-container').style.display = 'none';
        document.querySelector('.login-container').style.display = 'block';
    } catch (error) {
        alert("Failed to register: " + error.message);
    }
});


function displayTodos(todos) {
    const list = document.getElementById('myUL');
    list.innerHTML = ''; 
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.task;
        li.onclick = function() { selectItem(this); };
        li.ondblclick = async function() {
            try {
                const updatedTodos = await removeTodo(currUserEmail, todo.task);
                displayTodos(updatedTodos);
            } catch (error) {
                alert('Failed to remove todo');
            }
        };
        list.appendChild(li);
    });
}

let selectedItem = null;  
function selectItem(li) {
    if (selectedItem) {
        selectedItem.classList.remove('selected');
    }
    selectedItem = li;
    selectedItem.classList.add('selected');
}

document.querySelector('.addBtn').onclick = async function() {
    var inputValue = document.getElementById("myInput").value;
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        const updatedTodos = await addTodo(username.value, inputValue);
        displayTodos(updatedTodos);  
        document.getElementById("myInput").value = "";
    }
};

document.querySelector('.rmvBtn').onclick = async function() {
    if (selectedItem && currUserEmail) {
        try {
            const updatedTodos = await removeTodo(currUserEmail, selectedItem.textContent);
            displayTodos(updatedTodos);  
            selectedItem = null;
        } catch (error) {
            console.error('Error removing todo:', error);
            alert('Failed to remove todo');
        }
    } else {
        alert("No task selected!");
    }
};


