<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEdgesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('edges', function (Blueprint $table) {
            $table->id();
            $table->text('label')->nullable();
            $table->string('item_id');
            $table->integer('animated');
            $table->string('arrow');
            $table->string('type');
            $table->string('source');
            $table->string('target');
            $table->string('stroke')->nullable();
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
        Schema::dropIfExists('edges');
    }
}
