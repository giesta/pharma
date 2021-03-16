<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;
    protected $fillable = [
        'item_id', 'diagram_id', 'label', 'type', 'background', 'x', 'y',
    ];
}
