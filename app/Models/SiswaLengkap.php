<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SiswaLengkap extends Model
{
    protected $table = 'siswa_lengkap';
    
    protected $fillable = [
        'nomor_induk',
        'nisn',
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'anak_ke',
        'status_dalam_keluarga',
        'alamat',
        'kelas',
        'tanggal_diterima',
        'semester_diterima',
        'asal_sekolah',
        'alamat_asal_sekolah',
        'tahun_ijazah',
        'nomor_ijazah',
        'tahun_sttb',
        'nomor_sttb',
        'nama_ayah',
        'nama_ibu',
        'alamat_orang_tua',
        'pekerjaan_ayah',
        'pekerjaan_ibu',
        'nama_wali',
        'alamat_wali',
        'pekerjaan_wali',
        'nomor_telepon_ayah',
        'nomor_telepon_ibu',
        'nomor_telepon_wali',
        'is_alumni',
        'is_aktif',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_diterima' => 'date',
        'is_alumni' => 'boolean',
        'is_aktif' => 'boolean',
        'anak_ke' => 'integer',
        'semester_diterima' => 'integer',
    ];

    // Relationships
    public function nilaiAkademik(): HasMany
    {
        return $this->hasMany(NilaiAkademik::class);
    }

    public function surveiMinatBakat(): HasOne
    {
        return $this->hasOne(SurveiMinatBakat::class);
    }

    public function prediksiJurusan(): HasMany
    {
        return $this->hasMany(PrediksiJurusan::class);
    }

    // Accessors
    public function getTanggalLahirFormatAttribute()
    {
        return $this->tanggal_lahir ? $this->tanggal_lahir->format('d/m/Y') : null;
    }

    public function getUmurAttribute()
    {
        return $this->tanggal_lahir ? $this->tanggal_lahir->age : null;
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeAlumni($query)
    {
        return $query->where('is_alumni', true);
    }

    public function scopeKelas($query, $kelas)
    {
        return $query->where('kelas', $kelas);
    }
}
