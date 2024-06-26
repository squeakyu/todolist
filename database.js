const db = new PouchDB('todos');

async function registerUser(email, password){
    try {
        // Attempt to retrieve any existing user with the same email
        const response = await db.get(email);
        if (response) {
            console.error('Account already registered. Try logging in.');
            return { error: 'Account already registered. Try logging in.' };
        }
    } catch (err) {
        // The error "not_found" means the email is not yet registered
        if (err.name === 'not_found') {
            const user = {
                _id: email,
                password: password,  // Consider hashing this password before storage
                todos: []
            };
            try {
                await db.put(user);
                console.log('User registered');
                return { success: 'User registered successfully' };
            } catch (registerErr) {
                console.error('Error registering user:', registerErr);
                return { error: 'Error registering user' };
            }
        } else {
            // Handle other potential errors from the `db.get` call
            console.error('Error checking user existence:', err);
            return { error: 'Database access error' };
        }
    }
}


async function loginUser(email, password){
    try {
        const user = await db.get(email);
        if(user.password === password) {
            return user.todos;
        }else {
            throw new Error('Password is incorrect. Please try again.');
        }
    }catch(err) {
        if(err.name === 'not_found') {
            throw new Error('User not found');
        }else{
            throw err;
        }
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