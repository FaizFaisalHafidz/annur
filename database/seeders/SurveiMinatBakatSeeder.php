<?php

namespace Database\Seeders;

use App\Models\SurveiMinatBakat;
use App\Models\SiswaLengkap;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SurveiMinatBakatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data survei berdasarkan lampiran yang diberikan (menggunakan beberapa contoh)
        $surveiData = [
            [
                'siswa_lengkap_id' => 1, // AKMAL MAULANA SIDIQ
                'mata_pelajaran_diminati' => ['Matematika', 'Sejarah', 'Geografi'],
                'alasan_minat_mapel' => 'Suka dengan pembelajaran yang menantang logika dan sejarah',
                'rencana_kuliah' => 'Iya',
                'jurusan_diminati' => 'Teknik Sipil',
                'alasan_pilih_jurusan' => 'Tertarik dengan pembangunan infrastruktur',
                'kategori_jurusan' => 'Sains & Teknologi',
                'tahu_universitas' => 'Sudah',
                'ekstrakurikuler' => 'Olahraga (futsal)',
                'ekstrakurikuler_pengaruh' => 'Tidak',
                'pengaruh_keputusan' => 'Diri Sendiri',
                'pernah_tes_minat' => 'Iya, di sekolah',
                'tingkat_keyakinan' => 4,
                'tanggal_survei' => '2024-09-09 09:42:52',
            ],
            [
                'siswa_lengkap_id' => 2, // ALDIBA FAUZAQI FIRDAUS
                'mata_pelajaran_diminati' => ['Matematika', 'Fisika', 'Informatika'],
                'alasan_minat_mapel' => 'Suka dengan teknologi dan pemrograman',
                'rencana_kuliah' => 'Iya',
                'jurusan_diminati' => 'Teknik Informatika',
                'alasan_pilih_jurusan' => 'Peluang kerja yang luas dan dibutuhkan di masa depan',
                'kategori_jurusan' => 'Sains & Teknologi',
                'tahu_universitas' => 'Sudah',
                'ekstrakurikuler' => 'Olahraga (futsal)',
                'ekstrakurikuler_pengaruh' => 'Tidak',
                'pengaruh_keputusan' => 'Internet / Media Sosial',
                'pernah_tes_minat' => 'Iya, secara mandiri',
                'tingkat_keyakinan' => 4,
                'tanggal_survei' => '2024-09-09 09:57:44',
            ],
            [
                'siswa_lengkap_id' => 3, // ANISA FITRIA
                'mata_pelajaran_diminati' => ['Biologi', 'Kimia'],
                'alasan_minat_mapel' => 'Penjelasan yang dijelaskan oleh guru sangat jelas dan rinci',
                'rencana_kuliah' => 'Iya',
                'jurusan_diminati' => 'Keperawatan',
                'alasan_pilih_jurusan' => 'Ingin membantu orang lain dalam bidang kesehatan',
                'kategori_jurusan' => 'Kedokteran & Kesehatan',
                'tahu_universitas' => 'Sudah',
                'ekstrakurikuler' => 'OSIS',
                'ekstrakurikuler_pengaruh' => 'Tidak',
                'pengaruh_keputusan' => 'Diri Sendiri',
                'pernah_tes_minat' => 'Iya, di sekolah',
                'tingkat_keyakinan' => 5,
                'tanggal_survei' => '2024-09-09 10:02:41',
            ],
            [
                'siswa_lengkap_id' => 4, // BUNGA SEPTY AHMAD SYAH
                'mata_pelajaran_diminati' => ['Biologi', 'Bahasa Indonesia'],
                'alasan_minat_mapel' => 'Karena berguna untuk kuliah jurusan tata boga',
                'rencana_kuliah' => 'Iya',
                'jurusan_diminati' => 'Tata Boga',
                'alasan_pilih_jurusan' => 'Setelah kuliah ingin kerja di perhotelan bagian chef',
                'kategori_jurusan' => 'Seni & Design',
                'tahu_universitas' => 'Sudah',
                'ekstrakurikuler' => 'OSIS',
                'ekstrakurikuler_pengaruh' => 'Tidak',
                'pengaruh_keputusan' => 'Diri Sendiri',
                'pernah_tes_minat' => 'Iya, di sekolah',
                'tingkat_keyakinan' => 5,
                'tanggal_survei' => '2024-09-09 10:10:07',
            ],
            [
                'siswa_lengkap_id' => 5, // EKA RAMADHANI ADYSTIA
                'mata_pelajaran_diminati' => ['Ekonomi', 'Sosiologi'],
                'alasan_minat_mapel' => 'Ingin menambah wawasan tentang bisnis',
                'rencana_kuliah' => 'Masih ragu',
                'jurusan_diminati' => 'Manajemen',
                'alasan_pilih_jurusan' => 'Ingin menjadi pengusaha',
                'kategori_jurusan' => 'Ekonomi dan Bisnis',
                'tahu_universitas' => 'Belum',
                'ekstrakurikuler' => 'Content Creator',
                'ekstrakurikuler_pengaruh' => 'Ya',
                'pengaruh_keputusan' => 'Diri Sendiri',
                'pernah_tes_minat' => 'Belum pernah',
                'tingkat_keyakinan' => 3,
                'tanggal_survei' => '2024-09-09 10:13:41',
            ],
        ];

        foreach ($surveiData as $data) {
            SurveiMinatBakat::create($data);
        }
    }
}
