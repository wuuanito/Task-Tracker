const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Ruta al archivo tasks.json en el directorio del proyecto
const filePath = path.join(__dirname, 'tasks.json');

// Asegúrate de que el archivo JSON exista
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Leer tareas del archivo JSON
function readTasks() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Escribir tareas en el archivo JSON
function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Agregar una nueva tarea
function addTask(description) {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added successfully (ID: ${newTask.id})`);
}

// Configuración del comando 'add'
program
  .command('add <description>')
  .description('Add a new task')
  .action(addTask);

// Función para actualizar una tarea
function updateTask(id, newDescription) {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task ${id} updated successfully.`);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
}

// Configuración del comando 'update'
program
  .command('update <id> <newDescription>')
  .description('Update a task description')
  .action(updateTask);

// Función para eliminar una tarea
function deleteTask(id) {
  let tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    console.log(`Task ${id} deleted successfully.`);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
}

// Configuración del comando 'delete'
program
  .command('delete <id>')
  .description('Delete a task')
  .action(deleteTask);

// Función para listar tareas por estado
function listTasks(status) {
  const tasks = readTasks();
  const filteredTasks = status ? tasks.filter(t => t.status === status) : tasks;
  filteredTasks.forEach(task => {
    console.log(`${task.id}: ${task.description} [${task.status}]`);
  });
}

// Configuración del comando 'list'
program
  .command('list [status]')
  .description('List tasks by status (todo, in-progress, done)')
  .action(listTasks);

// Función para marcar una tarea como en progreso
function markInProgress(id) {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.status = 'in-progress';
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task ${id} marked as in-progress.`);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
}

// Configuración del comando 'mark-in-progress'
program
  .command('mark-in-progress <id>')
  .description('Mark a task as in progress')
  .action(markInProgress);

// Función para marcar una tarea como completada
function markDone(id) {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task ${id} marked as done.`);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
}

// Configuración del comando 'mark-done'
program
  .command('mark-done <id>')
  .description('Mark a task as done')
  .action(markDone);

// Procesar los argumentos de la línea de comandos
program.parse(process.argv);
