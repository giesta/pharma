<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDiagramIdToTreatmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->unsignedBigInteger('diagram_id')->nullable();
            
            $table->foreign('diagram_id')
              ->references('id')
              ->on('diagrams')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->dropForeign('treatments_diagram_id_foreign');
            $table->dropIndex('treatments_diagram_index');
            $table->dropColumn('diagram_id');
        });
    }
}
