import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCheck, FaUndo } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, { title });
      setTasks([res.data, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Complete
  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${id}`, { completed: !currentStatus });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">TaskMaster Pro</h1>
          <p className="text-gray-500">Manage your daily goals efficiently.</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={addTask} className="flex gap-4">
            <input
              type="text"
              className="flex-1 p-4 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-secondary text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
            >
              <FaPlus /> Add
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">No tasks yet. Start by adding one!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task._id} 
                className={`group flex items-center justify-between p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${task.completed ? 'border-green-500 bg-gray-50' : 'border-primary'}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task._id, task.completed)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  >
                    {task.completed ? <FaUndo size={14} /> : <FaCheck size={14} />}
                  </button>
                  <span className={`text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                    {task.title}
                  </span>
                </div>
                
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
