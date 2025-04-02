import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState<number | null>(null);
    const [dueDateDropdownOpen, setDueDateDropdownOpen] = useState<number | null>(null);
    const [manualDueDate, setManualDueDate] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
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
                setTitle('');
                setDescription('');
                fetchTasks();
            } else {
                alert('Error adding task!');
            }
        } catch (error) {
            console.error('Error:', error);
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
                setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, priority: priority } : task)));
                setPriorityDropdownOpen(null);
            } else {
                alert('Error updating priority!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDueDateSelect = async (taskId: number, dueDate: string) => {
        const formattedDate = formatDate(dueDate);

        if (!formattedDate) {
            alert('Invalid date format. Please use dd-mm-yyyy.');
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
                setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, due_date: formattedDate } : task)));
                setDueDateDropdownOpen(null);
                setManualDueDate(''); // Clear input field
            } else {
                alert('Error updating due date!');
            }
        } catch (error) {
            console.error('Error:', error);
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
                setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed: 1 } : task)));
            } else {
                alert('Error completing task!');
            }
        } catch (error) {
            console.error('Error:', error);
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
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
                setExpandedTaskId(null); // Close the description box
            } else {
                alert('Error deleting task!');
            }
        } catch (error) {
            console.error('Error:', error);
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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setPriorityDropdownOpen(null);
                setDueDateDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col bg-white p-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <h1 className="mb-4 text-2xl font-bold">My Tasks</h1>

                {/* Task Form */}
                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
                    <input
                        type="text"
                        name="title"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-[#1b1b18] dark:text-[#EDEDEC]"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Task description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-[#1b1b18] dark:text-[#EDEDEC]"
                    />
                    <button type="submit" className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white transition hover:bg-purple-700">
                        Add Task
                    </button>
                </form>

                {/* Task List */}
                <div className="flex">
                    <div className="w-1/2">
                        {tasks.map((task) => (
                            <div key={task.id} className="mb-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#1b1b18]">
                                <div className="flex items-center justify-between p-3">
                                    <span className="text-sm" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                        {task.title}
                                        {task.priority && (
                                            <span
                                                className={`ml-2 text-xs font-semibold ${
                                                    task.priority === 'High'
                                                        ? 'text-red-500'
                                                        : task.priority === 'Medium'
                                                          ? 'text-green-500'
                                                          : 'text-amber-500'
                                                }`}
                                            >
                                                ({task.priority})
                                            </span>
                                        )}
                                    </span>
                                    <button onClick={() => toggleDescription(task.id)} className="focus:outline-none">
                                        <svg
                                            className={`h-5 w-5 transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
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
                        <div className="ml-4 w-1/2 rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-[#1b1b18]">
                            <h3 className="mb-2 text-lg font-bold">
                                {tasks.find((task) => task.id === expandedTaskId)?.title || 'Task Name Not Found'}
                            </h3>
                            <h4 className="mb-1 font-semibold">Description</h4>
                            <p className="text-sm">{tasks.find((task) => task.id === expandedTaskId)?.description || 'No description provided.'}</p>
                            {tasks.find((task) => task.id === expandedTaskId)?.due_date && (
                                <p className="mt-2 text-sm">Due Date: {tasks.find((task) => task.id === expandedTaskId)?.due_date}</p>
                            )}

                            <div ref={dropdownRef} className="relative mt-auto flex flex-col">
                                <button
                                    onClick={() => setPriorityDropdownOpen(priorityDropdownOpen === expandedTaskId ? null : expandedTaskId)}
                                    className="mt-2 rounded-md bg-red-300 px-3 py-1 text-sm text-black transition hover:bg-red-400 dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
                                >
                                    Priority
                                </button>
                                {priorityDropdownOpen === expandedTaskId && (
                                    <div className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white py-2 shadow-xl dark:bg-[#1b1b18]">
                                        <button
                                            onClick={() => handlePrioritySelect(expandedTaskId, 'High')}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            High
                                        </button>
                                        <button
                                            onClick={() => handlePrioritySelect(expandedTaskId, 'Medium')}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Medium
                                        </button>
                                        <button
                                            onClick={() => handlePrioritySelect(expandedTaskId, 'Low')}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Low
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setDueDateDropdownOpen(dueDateDropdownOpen === expandedTaskId ? null : expandedTaskId)}
                                    className="mt-2 rounded-md bg-blue-300 px-3 py-1 text-sm text-black transition hover:bg-blue-400 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                                >
                                    Enter Due Date
                                </button>
                                {dueDateDropdownOpen === expandedTaskId && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="left absolute z-auto mt-auto bg-white p-2 shadow-xl dark:bg-[#1b1b18]"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter date dd-mm-yyyy"
                                            value={manualDueDate}
                                            onChange={(e) => setManualDueDate(e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (manualDueDate) {
                                                    handleDueDateSelect(expandedTaskId!, manualDueDate);
                                                    setDueDateDropdownOpen(null);
                                                }
                                            }}
                                            className="mt-2 rounded-md bg-green-500 px-3 py-1 text-sm text-white transition hover:bg-green-700 dark:bg-green-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleTaskComplete(expandedTaskId)}
                                    className="mt-2 rounded-md bg-green-500 px-3 py-1 text-sm text-white transition hover:bg-green-700 dark:bg-green-600"
                                >
                                    Task Completed
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(expandedTaskId)}
                                    className="mt-2 rounded-md bg-black px-3 py-1 text-sm text-white transition hover:bg-gray-900 dark:bg-gray-800"
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <footer className="mt-auto bg-gray-100 p-6 text-center dark:bg-[#1b1b18]">
                    <h2 className="mb-2 text-lg font-semibold">📌 Meanwhile, in the world of to-do lists… 👀</h2>
                    <p className="text-sm text-gray-600 italic dark:text-gray-300">
                        Task management is just a fancy way of saying "I’ll organize my procrastination. 📝😄"
                    </p>
                </footer>
            </div>
        </AppLayout>
    );
}
