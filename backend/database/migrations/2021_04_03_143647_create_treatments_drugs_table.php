<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTreatmentsDrugsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('treatments_drugs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('treatment_id');

            $table->foreign('treatment_id')
              ->references('id')
              ->on('treatments')->onDelete('cascade')->onUpdate('no action');

            $table->unsignedBigInteger('drug_id');
            
            $table->foreign('drug_id')
              ->references('id')
              ->on('drugs')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('treatments_drugs');
    }
}
