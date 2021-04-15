<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOverviewLeafletTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('overview_leaflet', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('overview_id');

            $table->foreign('overview_id')
              ->references('id')
              ->on('overviews')->onDelete('no action')->onUpdate('no action');

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
        Schema::dropIfExists('overview_leaflet');
    }
}
