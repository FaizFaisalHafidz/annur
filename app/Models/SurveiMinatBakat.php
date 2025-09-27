<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveiMinatBakat extends Model
{
    protected $table = 'survei_minat_bakat';
    
    protected $fillable = [
        'siswa_lengkap_id',
        'mata_pelajaran_diminati',
        'alasan_minat_mapel',
        'rencana_kuliah',
        'jurusan_diminati',
        'alasan_pilih_jurusan',
        'kategori_jurusan',
        'tahu_universitas',
        'ekstrakurikuler',
        'ekstrakurikuler_pengaruh',
        'pengaruh_keputusan',
        'pernah_tes_minat',
        'tingkat_keyakinan',
        'tanggal_survei',
    ];

    protected $casts = [
        'mata_pelajaran_diminati' => 'array',
        'tanggal_survei' => 'datetime',
        'tingkat_keyakinan' => 'integer',
    ];

    // Relationship
    public function siswaLengkap(): BelongsTo
    {
        return $this->belongsTo(SiswaLengkap::class);
    }

    // Accessor untuk mendapatkan mata pelajaran diminati sebagai string
    public function getMataPelajaranDiminatiStringAttribute()
    {
        return is_array($this->mata_pelajaran_diminati) 
            ? implode(', ', $this->mata_pelajaran_diminati) 
            : $this->mata_pelajaran_diminati;
    }

    // Method untuk cek apakah berencana kuliah
    public function getBerencanaKuliahAttribute()
    {
        return $this->rencana_kuliah === 'Iya';
    }

    // Method untuk mendapatkan level keyakinan
    public function getLevelKeyakinanAttribute()
    {
        switch ($this->tingkat_keyakinan) {
            case 1:
                return 'Sangat Tidak Yakin';
            case 2:
                return 'Tidak Yakin';
            case 3:
                return 'Cukup Yakin';
            case 4:
                return 'Yakin';
            case 5:
                return 'Sangat Yakin';
            default:
                return 'Tidak Diketahui';
        }
    }

    // Scopes
    public function scopeBerencanaKuliah($query)
    {
        return $query->where('rencana_kuliah', 'Iya');
    }

    public function scopeKategoriJurusan($query, $kategori)
    {
        return $query->where('kategori_jurusan', $kategori);
    }

    public function scopeTingkatKeyakinan($query, $tingkat)
    {
        return $query->where('tingkat_keyakinan', $tingkat);
    }
}
