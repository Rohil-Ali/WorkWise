<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::post('/add-task', [TaskController::class, 'add'])->name('add-task');
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::put('/tasks/{task}/priority', [TaskController::class, 'updatePriority'])->name('tasks.priority');
    Route::put('/tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::put('/tasks/{task}/due-date', [TaskController::class, 'updateDueDate'])->name('tasks.due-date');

    Route::get('calendar', function() {
        return Inertia::render('calendar');
    })->name('calendar');

    Route::get('timer', function() {
        return Inertia::render('timer');
    })->name('timer');

    Route::get('aboutUs', function() {
        return Inertia::render('aboutUs');
    })->name('aboutUs');
    

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
