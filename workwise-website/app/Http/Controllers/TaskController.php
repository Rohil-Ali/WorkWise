<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task1;

class TaskController extends Controller
{
    public function add(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    Task1::create([
        ...$validated,
        'completed' => 0,
        'priority' => null,
        'due_date' => null
    ]);

    return response()->json(['message' => 'Task created']);
}
    public function index()
    {
        // Fetch all tasks from the database
        $tasks = Task1::all();

        // Return tasks as JSON response
        return response()->json($tasks);
    }

    public function updatePriority(Request $request, Task1 $task)
    {
        $validated = $request->validate([
            'priority' => 'required|in:High,Medium,Low'
        ]);
    
        $task->update($validated);
        return response()->json(['message' => 'Priority updated']);
    }
    
    public function complete(Task1 $task)
{
    $task->update(['completed' => 1]);
    return response()->json(['message' => 'Task marked complete']);
}

    public function destroy(Task1 $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    public function updateDueDate(Request $request, Task1 $task)
{
    $validated = $request->validate([
        'due_date' => 'required|date',
    ]);

    $task->update($validated);
    return response()->json(['message' => 'Due date updated']);
}

}
