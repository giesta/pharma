<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOverviewsDrugsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('overviews_drugs', function (Blueprint $table) {
            $table->id();
            $table->string('uses');
            $table->unsignedBigInteger('overview_id');

            $table->foreign('overview_id')
              ->references('id')
              ->on('overviews')->onDelete('cascade')->onUpdate('no action');

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
        Schema::dropIfExists('overviews_drugs');
    }
}
