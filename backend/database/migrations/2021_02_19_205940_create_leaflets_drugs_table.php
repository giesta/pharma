<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeafletsDrugsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('disease_leaflet', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('disease_id');

            $table->foreign('disease_id')
              ->references('id')
              ->on('diseases')->onDelete('no action')->onUpdate('no action');

            $table->unsignedBigInteger('leaflet_id');
            
            $table->foreign('leaflet_id')
              ->references('id')
              ->on('leaflets')->onDelete('no action')->onUpdate('no action');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('disease_leaflet');
    }
}
