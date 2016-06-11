var todoList = require('./lib/todolist.js');

todoList.add('task 1');
todoList.list();
todoList.add('task 2');
todoList.change(2, 'task 2_1');
todoList.complete(2);
todoList.setPriority(2, 1);
//todoList.delete(2);