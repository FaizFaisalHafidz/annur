<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nilai_akademik', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_lengkap_id')->constrained('siswa_lengkap')->onDelete('cascade');
            
            // Nilai Mata Pelajaran Semester 1
            $table->integer('pabp_sem1')->nullable(); // Pendidikan Agama dan Budi Pekerti
            $table->integer('ppkn_sem1')->nullable(); // PPKn
            $table->integer('bahasa_indonesia_sem1')->nullable();
            $table->integer('matematika_wajib_sem1')->nullable();
            $table->integer('sejarah_indonesia_sem1')->nullable();
            $table->integer('bahasa_inggris_sem1')->nullable();
            $table->integer('seni_budaya_sem1')->nullable();
            $table->integer('pjok_sem1')->nullable(); // Pendidikan Jasmani Olahraga dan Kesehatan
            $table->integer('prakarya_sem1')->nullable();
            $table->integer('bahasa_sunda_sem1')->nullable();
            $table->integer('geografi_sem1')->nullable();
            $table->integer('sejarah_sem1')->nullable();
            $table->integer('sosiologi_sem1')->nullable();
            $table->integer('ekonomi_sem1')->nullable();
            $table->integer('bahasa_arab_sem1')->nullable();
            $table->integer('ilmu_akhlak_sem1')->nullable();
            
            // Nilai Mata Pelajaran Semester 2
            $table->integer('pabp_sem2')->nullable();
            $table->integer('ppkn_sem2')->nullable();
            $table->integer('bahasa_indonesia_sem2')->nullable();
            $table->integer('matematika_wajib_sem2')->nullable();
            $table->integer('sejarah_indonesia_sem2')->nullable();
            $table->integer('bahasa_inggris_sem2')->nullable();
            $table->integer('seni_budaya_sem2')->nullable();
            $table->integer('pjok_sem2')->nullable();
            $table->integer('prakarya_sem2')->nullable();
            $table->integer('bahasa_sunda_sem2')->nullable();
            $table->integer('geografi_sem2')->nullable();
            $table->integer('sejarah_sem2')->nullable();
            $table->integer('sosiologi_sem2')->nullable();
            $table->integer('ekonomi_sem2')->nullable();
            $table->integer('bahasa_arab_sem2')->nullable();
            $table->integer('ilmu_akhlak_sem2')->nullable();
            
            // Total dan rata-rata
            $table->integer('total_sem1')->nullable();
            $table->integer('total_sem2')->nullable();
            $table->integer('total_keseluruhan')->nullable();
            $table->decimal('rata_rata_sem1', 5, 2)->nullable();
            $table->decimal('rata_rata_sem2', 5, 2)->nullable();
            $table->decimal('rata_rata_keseluruhan', 5, 2)->nullable();
            
            // Tahun ajaran
            $table->string('tahun_ajaran');
            $table->string('kelas');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['siswa_lengkap_id', 'tahun_ajaran']);
            $table->index(['kelas']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_akademik');
    }
};
