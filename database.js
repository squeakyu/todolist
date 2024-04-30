const db = new PouchDB('todos');

async function registerUser(email, password){
    const user = {
        _id: email,
        password: password,
        todos: [],
    };
    try{
        await db.put(user);
        console.log('User registered');
    }catch(err){
        console.log('Error registering', err);
    }
}

async function loginUser(email, password){
    try{
        const user = await db.get(email);
        if(user.password === password){
            return user.todos;
        }else{
            throw new Error('Invalid username or password');
        }
    }catch(err){
        throw new Error('User not found');
    }
}

async function addTodo(email, task) {
    const user = await db.get(email);
    user.todos.push({ task: task });
    await db.put(user);
    return user.todos;
}

async function removeTodo(email, task) {
    const user = await db.get(email);
    user.todos = user.todos.filter(todo => todo.task !== task);
    await db.put(user);
    return user.todos;
}

async function getAllUsers() {
    try {
        const allUsers = await db.allDocs({
            include_docs: true
        });
        console.log('All registered users:', allUsers.rows.map(row => row.doc));
    } catch (err) {
        console.error('Error retrieving users:', err);
    }
}

// Call this function to log all user data
getAllUsers();

async function deleteUser(email) {
    try {
        // Fetch the user document by email ID
        const userDoc = await db.get(email);
        
        // Remove the user document from the database
        await db.remove(userDoc);
        console.log('User removed successfully:', email);
    } catch (err) {
        console.error('Error removing user:', err);
    }
}


export { registerUser, loginUser, addTodo, removeTodo };