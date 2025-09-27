<?php

namespace Database\Seeders;

use App\Models\NilaiAkademik;
use App\Models\SiswaLengkap;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NilaiAkademikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswaList = SiswaLengkap::all();
        
        // Data nilai berdasarkan lampiran yang diberikan
        $nilaiData = [
            // AKMAL MAULANA SIDIQ
            [
                'siswa_lengkap_id' => 1,
                'pabp_sem1' => 90, 'pabp_sem2' => 91,
                'ppkn_sem1' => 80, 'ppkn_sem2' => 80,
                'bahasa_indonesia_sem1' => 90, 'bahasa_indonesia_sem2' => 90,
                'matematika_wajib_sem1' => 80, 'matematika_wajib_sem2' => 79,
                'sejarah_indonesia_sem1' => 91, 'sejarah_indonesia_sem2' => 92,
                'bahasa_inggris_sem1' => 79, 'bahasa_inggris_sem2' => 79,
                'seni_budaya_sem1' => 92, 'seni_budaya_sem2' => 95,
                'pjok_sem1' => 85, 'pjok_sem2' => 85,
                'prakarya_sem1' => 82, 'prakarya_sem2' => 90,
                'bahasa_sunda_sem1' => 88, 'bahasa_sunda_sem2' => 88,
                'geografi_sem1' => 90, 'geografi_sem2' => 92,
                'sejarah_sem1' => 91, 'sejarah_sem2' => 92,
                'sosiologi_sem1' => 94, 'sosiologi_sem2' => 94,
                'ekonomi_sem1' => 88, 'ekonomi_sem2' => 88,
                'bahasa_arab_sem1' => 83, 'bahasa_arab_sem2' => 80,
                'ilmu_akhlak_sem1' => 82, 'ilmu_akhlak_sem2' => 82,
                'total_sem1' => 1385, 'total_sem2' => 1397,
                'total_keseluruhan' => 2782,
                'tahun_ajaran' => '2022/2023',
                'kelas' => 'X IPS-1',
            ],
            // ALDIBA FAUZAQI FIRDAUS
            [
                'siswa_lengkap_id' => 2,
                'pabp_sem1' => 90, 'pabp_sem2' => 91,
                'ppkn_sem1' => 82, 'ppkn_sem2' => 82,
                'bahasa_indonesia_sem1' => 90, 'bahasa_indonesia_sem2' => 90,
                'matematika_wajib_sem1' => 79, 'matematika_wajib_sem2' => 79,
                'sejarah_indonesia_sem1' => 93, 'sejarah_indonesia_sem2' => 94,
                'bahasa_inggris_sem1' => 79, 'bahasa_inggris_sem2' => 79,
                'seni_budaya_sem1' => 92, 'seni_budaya_sem2' => 95,
                'pjok_sem1' => 85, 'pjok_sem2' => 85,
                'prakarya_sem1' => 80, 'prakarya_sem2' => 90,
                'bahasa_sunda_sem1' => 85, 'bahasa_sunda_sem2' => 86,
                'geografi_sem1' => 91, 'geografi_sem2' => 93,
                'sejarah_sem1' => 93, 'sejarah_sem2' => 94,
                'sosiologi_sem1' => 94, 'sosiologi_sem2' => 94,
                'ekonomi_sem1' => 90, 'ekonomi_sem2' => 90,
                'bahasa_arab_sem1' => 88, 'bahasa_arab_sem2' => 85,
                'ilmu_akhlak_sem1' => 83, 'ilmu_akhlak_sem2' => 83,
                'total_sem1' => 1394, 'total_sem2' => 1410,
                'total_keseluruhan' => 2804,
                'tahun_ajaran' => '2022/2023',
                'kelas' => 'X IPS-1',
            ],
            // ANISA FITRIA
            [
                'siswa_lengkap_id' => 3,
                'pabp_sem1' => 92, 'pabp_sem2' => 93,
                'ppkn_sem1' => 80, 'ppkn_sem2' => 80,
                'bahasa_indonesia_sem1' => 90, 'bahasa_indonesia_sem2' => 90,
                'matematika_wajib_sem1' => 80, 'matematika_wajib_sem2' => 80,
                'sejarah_indonesia_sem1' => 92, 'sejarah_indonesia_sem2' => 93,
                'bahasa_inggris_sem1' => 80, 'bahasa_inggris_sem2' => 80,
                'seni_budaya_sem1' => 95, 'seni_budaya_sem2' => 96,
                'pjok_sem1' => 85, 'pjok_sem2' => 85,
                'prakarya_sem1' => 82, 'prakarya_sem2' => 90,
                'bahasa_sunda_sem1' => 84, 'bahasa_sunda_sem2' => 84,
                'geografi_sem1' => 89, 'geografi_sem2' => 91,
                'sejarah_sem1' => 92, 'sejarah_sem2' => 93,
                'sosiologi_sem1' => 94, 'sosiologi_sem2' => 94,
                'ekonomi_sem1' => 90, 'ekonomi_sem2' => 90,
                'bahasa_arab_sem1' => 81, 'bahasa_arab_sem2' => 78,
                'ilmu_akhlak_sem1' => 91, 'ilmu_akhlak_sem2' => 91,
                'total_sem1' => 1397, 'total_sem2' => 1408,
                'total_keseluruhan' => 2805,
                'tahun_ajaran' => '2022/2023',
                'kelas' => 'X IPS-1',
            ],
            // BUNGA SEPTY AHMAD SYAH
            [
                'siswa_lengkap_id' => 4,
                'pabp_sem1' => 89, 'pabp_sem2' => 90,
                'ppkn_sem1' => 83, 'ppkn_sem2' => 83,
                'bahasa_indonesia_sem1' => 90, 'bahasa_indonesia_sem2' => 90,
                'matematika_wajib_sem1' => 83, 'matematika_wajib_sem2' => 85,
                'sejarah_indonesia_sem1' => 93, 'sejarah_indonesia_sem2' => 94,
                'bahasa_inggris_sem1' => 80, 'bahasa_inggris_sem2' => 80,
                'seni_budaya_sem1' => 92, 'seni_budaya_sem2' => 95,
                'pjok_sem1' => 85, 'pjok_sem2' => 85,
                'prakarya_sem1' => 85, 'prakarya_sem2' => 90,
                'bahasa_sunda_sem1' => 85, 'bahasa_sunda_sem2' => 86,
                'geografi_sem1' => 87, 'geografi_sem2' => 89,
                'sejarah_sem1' => 93, 'sejarah_sem2' => 94,
                'sosiologi_sem1' => 94, 'sosiologi_sem2' => 94,
                'ekonomi_sem1' => 90, 'ekonomi_sem2' => 90,
                'bahasa_arab_sem1' => 82, 'bahasa_arab_sem2' => 80,
                'ilmu_akhlak_sem1' => 85, 'ilmu_akhlak_sem2' => 83,
                'total_sem1' => 1396, 'total_sem2' => 1408,
                'total_keseluruhan' => 2804,
                'tahun_ajaran' => '2022/2023',
                'kelas' => 'X IPS-1',
            ],
            // EKA RAMADHANI ADYSTIA
            [
                'siswa_lengkap_id' => 5,
                'pabp_sem1' => 89, 'pabp_sem2' => 90,
                'ppkn_sem1' => 80, 'ppkn_sem2' => 80,
                'bahasa_indonesia_sem1' => 91, 'bahasa_indonesia_sem2' => 91,
                'matematika_wajib_sem1' => 87, 'matematika_wajib_sem2' => 87,
                'sejarah_indonesia_sem1' => 95, 'sejarah_indonesia_sem2' => 96,
                'bahasa_inggris_sem1' => 80, 'bahasa_inggris_sem2' => 80,
                'seni_budaya_sem1' => 96, 'seni_budaya_sem2' => 96,
                'pjok_sem1' => 85, 'pjok_sem2' => 85,
                'prakarya_sem1' => 85, 'prakarya_sem2' => 90,
                'bahasa_sunda_sem1' => 89, 'bahasa_sunda_sem2' => 90,
                'geografi_sem1' => 92, 'geografi_sem2' => 94,
                'sejarah_sem1' => 95, 'sejarah_sem2' => 96,
                'sosiologi_sem1' => 94, 'sosiologi_sem2' => 94,
                'ekonomi_sem1' => 96, 'ekonomi_sem2' => 96,
                'bahasa_arab_sem1' => 86, 'bahasa_arab_sem2' => 83,
                'ilmu_akhlak_sem1' => 92, 'ilmu_akhlak_sem2' => 92,
                'total_sem1' => 1432, 'total_sem2' => 1440,
                'total_keseluruhan' => 2872,
                'tahun_ajaran' => '2022/2023',
                'kelas' => 'X IPS-1',
            ],
        ];

        foreach ($nilaiData as $data) {
            // Hitung rata-rata
            $totalMapel = 16; // Total mata pelajaran
            $data['rata_rata_sem1'] = round($data['total_sem1'] / $totalMapel, 2);
            $data['rata_rata_sem2'] = round($data['total_sem2'] / $totalMapel, 2);
            $data['rata_rata_keseluruhan'] = round($data['total_keseluruhan'] / ($totalMapel * 2), 2);
            
            NilaiAkademik::create($data);
        }
    }
}
