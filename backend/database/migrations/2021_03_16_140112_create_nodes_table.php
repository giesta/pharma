<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nodes', function (Blueprint $table) {
            $table->id();
            $table->text('label')->nullable();
            $table->string('item_id');
            $table->string('x');
            $table->string('y');
            $table->string('type');
            $table->string('background')->nullable();
            $table->unsignedBigInteger('diagram_id');
            $table->timestamps();

            $table->index('diagram_id');
            $table->foreign('diagram_id')
                ->references('id')->on('diagrams')
                ->onDelete('cascade')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nodes');
    }
}
