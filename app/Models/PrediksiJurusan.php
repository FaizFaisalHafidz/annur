<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrediksiJurusan extends Model
{
    use HasFactory;

    protected $table = 'prediksi_jurusan';

    protected $fillable = [
        'siswa_lengkap_id',
        'nilai_mata_pelajaran',
        'mata_pelajaran_dikuasai',
        'minat_ipa',
        'minat_ips',
        'minat_bahasa',
        'minat_seni',
        'minat_olahraga',
        'jurusan_prediksi',
        'kategori_jurusan_prediksi',
        'confidence_score',
        'alternatif_jurusan',
        'model_version',
        'parameter_input',
        'user_id',
        'tanggal_prediksi',
        'keterangan',
    ];

    protected $casts = [
        'nilai_mata_pelajaran' => 'array',
        'mata_pelajaran_dikuasai' => 'array',
        'minat_ipa' => 'decimal:2',
        'minat_ips' => 'decimal:2',
        'minat_bahasa' => 'decimal:2',
        'minat_seni' => 'decimal:2',
        'minat_olahraga' => 'decimal:2',
        'confidence_score' => 'decimal:4',
        'alternatif_jurusan' => 'array',
        'parameter_input' => 'array',
        'tanggal_prediksi' => 'datetime',
    ];

    public function siswaLengkap(): BelongsTo
    {
        return $this->belongsTo(SiswaLengkap::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
