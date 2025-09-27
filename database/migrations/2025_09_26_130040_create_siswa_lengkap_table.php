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
        Schema::create('siswa_lengkap', function (Blueprint $table) {
            $table->id();
            
            // Data Identitas Siswa
            $table->string('nomor_induk')->unique();
            $table->string('nisn')->unique();
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('agama');
            $table->integer('anak_ke')->nullable();
            $table->string('status_dalam_keluarga')->default('Anak Kandung');
            $table->text('alamat');
            $table->string('kelas');
            $table->date('tanggal_diterima');
            $table->integer('semester_diterima')->default(1);
            
            // Data Sekolah Asal
            $table->string('asal_sekolah')->nullable();
            $table->string('alamat_asal_sekolah')->nullable();
            $table->string('tahun_ijazah')->nullable();
            $table->string('nomor_ijazah')->nullable();
            $table->string('tahun_sttb')->nullable();
            $table->string('nomor_sttb')->nullable();
            
            // Data Orang Tua/Wali
            $table->string('nama_ayah');
            $table->string('nama_ibu');
            $table->text('alamat_orang_tua');
            $table->string('pekerjaan_ayah');
            $table->string('pekerjaan_ibu');
            $table->string('nama_wali')->nullable();
            $table->text('alamat_wali')->nullable();
            $table->string('pekerjaan_wali')->nullable();
            $table->string('nomor_telepon_ayah')->nullable();
            $table->string('nomor_telepon_ibu')->nullable();
            $table->string('nomor_telepon_wali')->nullable();
            
            // Status
            $table->boolean('is_alumni')->default(false);
            $table->boolean('is_aktif')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['kelas', 'is_aktif']);
            $table->index(['jenis_kelamin']);
            $table->index(['is_alumni']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa_lengkap');
    }
};
