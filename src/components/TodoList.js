import React, { useState, useEffect } from 'react';

const TodoList = ({ onGoalComplete }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const toggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    const completedTask = tasks.find((task) => task.id === taskId);
    if (completedTask && !completedTask.completed) {
      onGoalComplete();
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl mb-6">
      <h2 className="text-2xl font-bold mb-4">Daily Goals</h2>
      <form onSubmit={addTask} className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new goal..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-3 border rounded-lg flex justify-between items-center ${
              task.completed ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
            }`}
          >
            <span
              className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {task.text}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleComplete(task.id)}
                className="p-1 text-green-500 hover:text-green-700"
                aria-label="Mark as complete"
              >
                ✓
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Delete task"
              >
                ✗
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;