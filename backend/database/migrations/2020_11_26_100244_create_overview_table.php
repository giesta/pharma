<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOverviewTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('overviews', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->text('diagnosis');
            $table->text('prevention');
            $table->unsignedBigInteger('disease_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->index('disease_id');
            $table->foreign('disease_id')
                ->references('id')->on('diseases')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->index('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
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
        Schema::dropIfExists('overviews');
    }
}
