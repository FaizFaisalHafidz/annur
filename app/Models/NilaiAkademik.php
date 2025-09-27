<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiAkademik extends Model
{
    protected $table = 'nilai_akademik';
    
    protected $fillable = [
        'siswa_lengkap_id',
        'pabp_sem1', 'ppkn_sem1', 'bahasa_indonesia_sem1', 'matematika_wajib_sem1',
        'sejarah_indonesia_sem1', 'bahasa_inggris_sem1', 'seni_budaya_sem1', 'pjok_sem1',
        'prakarya_sem1', 'bahasa_sunda_sem1', 'geografi_sem1', 'sejarah_sem1',
        'sosiologi_sem1', 'ekonomi_sem1', 'bahasa_arab_sem1', 'ilmu_akhlak_sem1',
        'pabp_sem2', 'ppkn_sem2', 'bahasa_indonesia_sem2', 'matematika_wajib_sem2',
        'sejarah_indonesia_sem2', 'bahasa_inggris_sem2', 'seni_budaya_sem2', 'pjok_sem2',
        'prakarya_sem2', 'bahasa_sunda_sem2', 'geografi_sem2', 'sejarah_sem2',
        'sosiologi_sem2', 'ekonomi_sem2', 'bahasa_arab_sem2', 'ilmu_akhlak_sem2',
        'total_sem1', 'total_sem2', 'total_keseluruhan',
        'rata_rata_sem1', 'rata_rata_sem2', 'rata_rata_keseluruhan',
        'tahun_ajaran', 'kelas'
    ];

    protected $casts = [
        'rata_rata_sem1' => 'decimal:2',
        'rata_rata_sem2' => 'decimal:2',
        'rata_rata_keseluruhan' => 'decimal:2',
    ];

    // Relationship
    public function siswaLengkap(): BelongsTo
    {
        return $this->belongsTo(SiswaLengkap::class);
    }

    // Method untuk menghitung total dan rata-rata
    public function hitungTotalSem1()
    {
        $nilai = [
            $this->pabp_sem1, $this->ppkn_sem1, $this->bahasa_indonesia_sem1,
            $this->matematika_wajib_sem1, $this->sejarah_indonesia_sem1, $this->bahasa_inggris_sem1,
            $this->seni_budaya_sem1, $this->pjok_sem1, $this->prakarya_sem1, $this->bahasa_sunda_sem1,
            $this->geografi_sem1, $this->sejarah_sem1, $this->sosiologi_sem1, $this->ekonomi_sem1,
            $this->bahasa_arab_sem1, $this->ilmu_akhlak_sem1
        ];
        
        return array_sum(array_filter($nilai));
    }

    public function hitungTotalSem2()
    {
        $nilai = [
            $this->pabp_sem2, $this->ppkn_sem2, $this->bahasa_indonesia_sem2,
            $this->matematika_wajib_sem2, $this->sejarah_indonesia_sem2, $this->bahasa_inggris_sem2,
            $this->seni_budaya_sem2, $this->pjok_sem2, $this->prakarya_sem2, $this->bahasa_sunda_sem2,
            $this->geografi_sem2, $this->sejarah_sem2, $this->sosiologi_sem2, $this->ekonomi_sem2,
            $this->bahasa_arab_sem2, $this->ilmu_akhlak_sem2
        ];
        
        return array_sum(array_filter($nilai));
    }

    public function hitungRataRataSem1()
    {
        $nilai = [
            $this->pabp_sem1, $this->ppkn_sem1, $this->bahasa_indonesia_sem1,
            $this->matematika_wajib_sem1, $this->sejarah_indonesia_sem1, $this->bahasa_inggris_sem1,
            $this->seni_budaya_sem1, $this->pjok_sem1, $this->prakarya_sem1, $this->bahasa_sunda_sem1,
            $this->geografi_sem1, $this->sejarah_sem1, $this->sosiologi_sem1, $this->ekonomi_sem1,
            $this->bahasa_arab_sem1, $this->ilmu_akhlak_sem1
        ];
        
        $nilaiValid = array_filter($nilai);
        return count($nilaiValid) > 0 ? array_sum($nilaiValid) / count($nilaiValid) : 0;
    }

    public function hitungRataRataSem2()
    {
        $nilai = [
            $this->pabp_sem2, $this->ppkn_sem2, $this->bahasa_indonesia_sem2,
            $this->matematika_wajib_sem2, $this->sejarah_indonesia_sem2, $this->bahasa_inggris_sem2,
            $this->seni_budaya_sem2, $this->pjok_sem2, $this->prakarya_sem2, $this->bahasa_sunda_sem2,
            $this->geografi_sem2, $this->sejarah_sem2, $this->sosiologi_sem2, $this->ekonomi_sem2,
            $this->bahasa_arab_sem2, $this->ilmu_akhlak_sem2
        ];
        
        $nilaiValid = array_filter($nilai);
        return count($nilaiValid) > 0 ? array_sum($nilaiValid) / count($nilaiValid) : 0;
    }
}
