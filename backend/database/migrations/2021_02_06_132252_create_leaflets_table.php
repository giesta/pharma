<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeafletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leaflets', function (Blueprint $table) {
                    
            $table->id();
            $table->string('indication');
            $table->string('contraindication');
            $table->string('reaction');
            $table->string('use');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('drug_id');
            $table->string('link')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('no action');

            $table->index('drug_id');
            $table->foreign('drug_id')
                ->references('id')->on('drugs')
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
        Schema::dropIfExists('leaflets');
    }
}
