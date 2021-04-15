<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edge extends Model
{
    use HasFactory;
    protected $fillable = [
        'item_id', 'diagram_id', 'animated', 'arrow', 'label', 'stroke', 'source', 'target', 'type',
    ];
}
