<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDrugsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drugs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('strength')->nullable();
            $table->string('form')->nullable();
            $table->text('package')->nullable();
            $table->text('package_description')->nullable();
            $table->string('registration')->nullable();
            $table->unsignedBigInteger('substance_id');
            $table->string('link')->nullable();
            $table->timestamps();

            $table->index('substance_id');
            $table->foreign('substance_id')
                ->references('id')->on('substances')
                ->onDelete('no action')
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
        Schema::dropIfExists('drugs');
    }
}
