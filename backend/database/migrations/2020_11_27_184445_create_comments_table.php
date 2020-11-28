<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('content')->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('treatment_id');  
            $table->timestamps();

            $table->index('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('no action');

            $table->index('treatment_id');
            $table->foreign('treatment_id')->references('id')->on('treatments')
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
        Schema::dropIfExists('comments');
    }
}
