import React, { useState, useRef, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Task {
    id: number;
    title: string;
    description: string | null;
    completed: number;
    priority: 'High' | 'Medium' | 'Low' | null;
    due_date: string | null;
    created_at?: string;
    updated_at?: string;
}

const formatDate = (dateString: string) => {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        console.error('Invalid date format. Expected dd-mm-yyyy.');
        return null;
    }
    const [day, month, year] = parts;
    if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
        console.error('Invalid date format. Day, month, and year must be numeric.');
        return null;
    }
    if (Number(day) < 1 || Number(day) > 31 || Number(month) < 1 || Number(month) > 12) {
        console.error('Invalid date: Day or month out of range.');
        return null;
    }
    return `${year}-${month}-${day}`;
};

export default function Dashboard() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState<number | null>(null);
    const [dueDateDropdownOpen, setDueDateDropdownOpen] = useState<number | null>(null);
    const [manualDueDate, setManualDueDate] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                setTitle("");
                setDescription("");
                fetchTasks();
            } else {
                alert("Error adding task!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleDescription = (taskId: number) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const handlePrioritySelect = async (taskId: number, priority: 'High' | 'Medium' | 'Low') => {
        try {
            const response = await fetch(`/tasks/${taskId}/priority`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ priority }),
            });

            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, priority: priority } : task
                    )
                );
                setPriorityDropdownOpen(null);
            } else {
                alert("Error updating priority!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDueDateSelect = async (taskId: number, dueDate: string) => {
        const formattedDate = formatDate(dueDate);

        if (!formattedDate) {
            alert("Invalid date format. Please use dd-mm-yyyy.");
            return;
        }

        try {
            const response = await fetch(`/tasks/${taskId}/due-date`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ due_date: formattedDate }),
            });

            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, due_date: formattedDate } : task
                    )
                );
                setDueDateDropdownOpen(null);
                setManualDueDate(""); // Clear input field
            } else {
                alert("Error updating due date!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleTaskComplete = async (taskId: number) => {
        try {
            const response = await fetch(`/tasks/${taskId}/complete`, {
                method: 'PUT',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, completed: 1 } : task
                    )
                );
            } else {
                alert("Error completing task!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
                setExpandedTaskId(null); // Close the description box
            } else {
                alert("Error deleting task!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePriorityButtonClick = (taskId: number) => {
        setPriorityDropdownOpen(priorityDropdownOpen === taskId ? null : taskId);
    };

    const handleDueDateButtonClick = (taskId: number) => {
        setDueDateDropdownOpen(dueDateDropdownOpen === taskId ? null : taskId);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setPriorityDropdownOpen(null);
                setDueDateDropdownOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col p-6">
                <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

                {/* Task Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                    <input
                        type="text"
                        name="title"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Task description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-3 py-1 text-sm rounded-md hover:bg-purple-700 transition"
                    >
                        Add Task
                    </button>
                </form>

               {/* Task List */}
               <div className="flex">
                   <div className="w-1/2">
                       {tasks.map((task) => (
                           <div key={task.id} className="mb-2 border border-gray-300 rounded-md">
                               <div className="flex items-center justify-between p-3">
                                   <span className="text-sm" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                       {task.title}
                                       {task.priority && (
                                           <span className={`ml-2 text-xs font-semibold ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-green-500' : 'text-amber-500'}`}>
                                               ({task.priority})
                                           </span>
                                       )}
                                   </span>
                                   <button onClick={() => toggleDescription(task.id)} className="focus:outline-none">
                                       <svg
                                           className={`w-5 h-5 transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                                           fill="none"
                                           stroke="currentColor"
                                           viewBox="0 0 24 24"
                                           xmlns="http://www.w3.org/2000/svg"
                                       >
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                       </svg>
                                   </button>
                               </div>
                           </div>
                       ))}
                   </div>

                   {/* Description Box */}
                   {expandedTaskId && (
                    <div className="w-1/2 p-3 border border-grey-400 rounded-md ml-4">
                        {/* Task Name */}
                        <h3 className="font-bold text-lg mb-2">
                            {tasks.find(task => task.id === expandedTaskId)?.title || "Task Name Not Found"}
                        </h3>
                        
                        {/* Description Heading */}
                        <h4 className="font-semibold mb-1">Description</h4>
                        
                        {/* Task Description */}
                        <p className="text-sm">
                            {tasks.find(task => task.id === expandedTaskId)?.description || "No description provided."}
                        </p>

                        {/* Display Due Date */}
                        {tasks.find(task => task.id === expandedTaskId)?.due_date && (
                            <p className="text-sm mt-2">Due Date: {tasks.find(task => task.id === expandedTaskId)?.due_date}</p>
                        )}

                        {/* Buttons */}
                        <div ref={dropdownRef} className="mt-auto flex flex-col relative">
                            {/* Priority Button */}
                            <button 
                                onClick={() => 
                                    setPriorityDropdownOpen(priorityDropdownOpen === expandedTaskId ? null : expandedTaskId)
                                } 
                                className="bg-red-300 text-black px-3 py-1 text-sm rounded-md hover:bg-red-400 transition mt-2"
                            >
                                Priority
                            </button>
                        
                            {/* Priority Dropdown */}
                            {priorityDropdownOpen === expandedTaskId && (
                                <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                                    <button onClick={() => handlePrioritySelect(expandedTaskId, 'High')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">High</button>
                                    <button onClick={() => handlePrioritySelect(expandedTaskId, 'Medium')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Medium</button>
                                    <button onClick={() => handlePrioritySelect(expandedTaskId, 'Low')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Low</button>
                                </div>
                            )}
                            
                            {/* Due Date Button */}
                            <button 
                                onClick={() => 
                                    setDueDateDropdownOpen(dueDateDropdownOpen === expandedTaskId ? null : expandedTaskId)
                                } 
                                className="bg-blue-300 text-black px-3 py-1 text-sm rounded-md hover:bg-blue-400 transition mt-2"
                            >
                                Enter Due Date
                            </button>
                            
                            {/* Due Date Dropdown */}
                            {dueDateDropdownOpen === expandedTaskId && (
                                <div onClick={(e) => e.stopPropagation()} className="absolute left mt-auto bg-white shadow-xl z-auto p-2">
                                    <input
                                        type="text"
                                        placeholder="Enter date dd-mm-yyyy"
                                        value={manualDueDate}
                                        onChange={(e) => setManualDueDate(e.target.value)}
                                        className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full border border-gray-300 rounded-md"
                                    />
                                    {/* Submit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            if (manualDueDate) {
                                                handleDueDateSelect(expandedTaskId!, manualDueDate);
                                                setDueDateDropdownOpen(null);
                                            }
                                        }}
                                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition mt-2"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                            
                            {/* Task Complete Button */}
                            <button onClick={() => handleTaskComplete(expandedTaskId)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition mt-2">
                                Task Completed
                            </button>
                            
                            {/* Delete Task Button */}
                            <button onClick={() => handleDeleteTask(expandedTaskId)} className="bg-black text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800 transition mt-2">
                                Delete Task
                            </button>
                        </div>
                    </div>
                )}

               </div>
               {/* Footer Section */}
               <footer className="mt-auto bg-gray-100 p-6 text-center">
                    <h2 className="text-lg font-semibold mb-2">📌Meanwhile, in the world of to-do lists…👀</h2>
                    <p className="text-sm text-gray-600 italic">Task management is just a fancy way of saying "I’ll organize my procrastination.📝😄"</p>
                </footer>
           </div>
       </AppLayout>
   );
}
