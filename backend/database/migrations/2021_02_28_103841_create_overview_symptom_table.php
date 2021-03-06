<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOverviewSymptomTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('overview_symptom', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('overview_id');

            $table->foreign('overview_id')
              ->references('id')
              ->on('overviews')->onDelete('cascade')->onUpdate('no action');

            $table->unsignedBigInteger('symptom_id');
            
            $table->foreign('symptom_id')
              ->references('id')
              ->on('symptoms')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('overview_symptom');
    }
}
