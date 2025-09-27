<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('prediksi_jurusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_lengkap_id')->constrained('siswa_lengkap')->onDelete('cascade');
            
            // Input untuk prediksi
            $table->json('nilai_mata_pelajaran'); // Nilai yang digunakan untuk prediksi
            $table->json('mata_pelajaran_dikuasai'); // Array mata pelajaran yang dikuasai
            $table->decimal('minat_ipa', 3, 2)->default(0.0);
            $table->decimal('minat_ips', 3, 2)->default(0.0);
            $table->decimal('minat_bahasa', 3, 2)->default(0.0);
            $table->decimal('minat_seni', 3, 2)->default(0.0);
            $table->decimal('minat_olahraga', 3, 2)->default(0.0);
            
            // Hasil prediksi
            $table->string('jurusan_prediksi');
            $table->string('kategori_jurusan_prediksi');
            $table->decimal('confidence_score', 5, 4); // Tingkat kepercayaan prediksi
            $table->json('alternatif_jurusan')->nullable(); // 3 alternatif teratas
            
            // Metadata
            $table->string('model_version')->default('1.0');
            $table->json('parameter_input'); // Semua parameter yang digunakan
            $table->timestamp('tanggal_prediksi');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['siswa_lengkap_id', 'tanggal_prediksi']);
            $table->index('jurusan_prediksi');
            $table->index('kategori_jurusan_prediksi');
        });
    }

    public function down()
    {
        Schema::dropIfExists('prediksi_jurusan');
    }
};