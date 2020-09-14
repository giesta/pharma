<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiseasesDrugsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('diseases_drugs', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('disease_id');

            $table->foreign('disease_id')
              ->references('id')
              ->on('diseases')->onDelete('no action')->onUpdate('no action');

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
        Schema::dropIfExists('diseases_drugs');
    }
}
