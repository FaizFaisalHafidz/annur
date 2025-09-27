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
        Schema::create('survei_minat_bakat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_lengkap_id')->constrained('siswa_lengkap')->onDelete('cascade');
            
            // Data Survei Minat dan Bakat
            $table->json('mata_pelajaran_diminati'); // Array mata pelajaran yang diminati
            $table->text('alasan_minat_mapel')->nullable(); // Alasan menyukai mata pelajaran
            $table->enum('rencana_kuliah', ['Iya', 'Tidak', 'Masih ragu']);
            $table->string('jurusan_diminati')->nullable();
            $table->text('alasan_pilih_jurusan')->nullable();
            $table->string('kategori_jurusan')->nullable(); // Sains & Teknologi, Ekonomi dan Bisnis, dll
            $table->enum('tahu_universitas', ['Sudah', 'Belum']);
            $table->string('ekstrakurikuler')->nullable();
            $table->enum('ekstrakurikuler_pengaruh', ['Ya', 'Tidak', 'Mungkin']);
            $table->enum('pengaruh_keputusan', ['Diri Sendiri', 'Orang Tua', 'Internet / Media Sosial']);
            $table->enum('pernah_tes_minat', ['Iya, di sekolah', 'Iya, secara mandiri', 'Belum pernah']);
            $table->integer('tingkat_keyakinan'); // 1-5
            
            // Timestamp survei
            $table->timestamp('tanggal_survei');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['siswa_lengkap_id']);
            $table->index(['kategori_jurusan']);
            $table->index(['rencana_kuliah']);
            $table->index(['tingkat_keyakinan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survei_minat_bakat');
    }
};
