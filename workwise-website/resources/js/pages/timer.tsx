import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Timer', //title ontop of page
        href: '/timer', //link to page
    },
];

const Timer = () => {
    const [time, setTime] = useState(1500); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [mode, setMode] = useState('Pomodoro');

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isActive, isPaused, time]);

    //Evnt handlers for the buttons
    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        setTime(mode === 'Pomodoro' ? 1500 : mode === 'Short Break' ? 300 : 900);
    };

    const handleModeChange = (newMode: string) => {
        setMode(newMode);
        setTime(newMode === 'Pomodoro' ? 1500 : newMode === 'Short Break' ? 300 : 900);
        setIsActive(false);
        setIsPaused(false);
    };

    //changes the time fomat to MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Timer" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
                <h1 className="mb-8 text-6xl font-bold text-gray-900 dark:text-gray-100">Timer</h1>
                <div className="flex h-auto w-160 flex-col items-center justify-center rounded-lg bg-gray-100 p-12 shadow-lg dark:bg-gray-800">
                    <div className="mb-12 flex gap-16">
                        <button
                            onClick={() => handleModeChange('Pomodoro')}
                            className={`rounded-full px-6 py-3 ${
                                mode === 'Pomodoro' ? 'bg-purple-500 text-white' : 'bg-purple-200 dark:bg-purple-700 dark:text-gray-100'
                            }`}
                        >
                            Pomodoro
                        </button>
                        <button
                            onClick={() => handleModeChange('Short Break')}
                            className={`rounded-full px-6 py-3 ${
                                mode === 'Short Break' ? 'bg-purple-500 text-white' : 'bg-purple-200 dark:bg-purple-700 dark:text-gray-100'
                            }`}
                        >
                            Short Break
                        </button>
                        <button
                            onClick={() => handleModeChange('Long Break')}
                            className={`rounded-full px-6 py-3 ${
                                mode === 'Long Break' ? 'bg-purple-500 text-white' : 'bg-purple-200 dark:bg-purple-700 dark:text-gray-100'
                            }`}
                        >
                            Long Break
                        </button>
                    </div>
                    <div className="flex h-72 w-full items-center justify-center">
                        <span className="text-9xl font-bold text-gray-900 dark:text-gray-100">{formatTime(time)}</span>
                    </div>
                    <div className="mt-12 flex gap-4">
                        <button onClick={handleStart} className="rounded-full bg-purple-500 px-10 py-5 text-white shadow-lg hover:bg-purple-600">
                            START
                        </button>
                        <button onClick={handlePause} className="rounded-full bg-purple-500 px-10 py-5 text-white shadow-lg hover:bg-purple-600">
                            {isPaused ? 'RESUME' : 'PAUSE'}
                        </button>
                        <button onClick={handleReset} className="rounded-full bg-purple-500 px-10 py-5 text-white shadow-lg hover:bg-purple-600">
                            RESET
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Timer;
