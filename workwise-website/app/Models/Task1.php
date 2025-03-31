<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task1 extends Model
{
    use HasFactory;
    protected $table = 'task1s';
    protected $fillable = [
        'title',
        'description',
        'completed', 
        'priority',
        'due_date' 
    ];
}
