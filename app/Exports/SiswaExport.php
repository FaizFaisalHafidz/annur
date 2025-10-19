<?php

namespace App\Exports;

use App\Models\SiswaLengkap;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SiswaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    /**
     * Return collection of students data
     */
    public function collection()
    {
        return SiswaLengkap::with(['nilaiAkademik', 'surveiMinatBakat'])
            ->orderBy('nama_lengkap')
            ->get();
    }

    /**
     * Define headings for Excel
     */
    public function headings(): array
    {
        return [
            // Data Siswa
            'Nomor Induk',
            'NISN',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Agama',
            'Anak Ke',
            'Status dalam Keluarga',
            'Alamat',
            'Kelas',
            'Tanggal Diterima',
            'Semester Diterima',
            'Asal Sekolah',
            'Alamat Asal Sekolah',
            'Tahun Ijazah',
            'Nomor Ijazah',
            'Tahun STTB',
            'Nomor STTB',
            'Nama Ayah',
            'Nama Ibu',
            'Alamat Orang Tua',
            'Pekerjaan Ayah',
            'Pekerjaan Ibu',
            'Nama Wali',
            'Alamat Wali',
            'Pekerjaan Wali',
            'No. Telepon Ayah',
            'No. Telepon Ibu',
            'No. Telepon Wali',
            'Status Aktif',
            'Status Alumni',
            
            // Nilai Akademik Semester 1
            'PABP Sem 1',
            'PPKN Sem 1',
            'B. Indonesia Sem 1',
            'Matematika Sem 1',
            'Sejarah Indonesia Sem 1',
            'B. Inggris Sem 1',
            'Seni Budaya Sem 1',
            'PJOK Sem 1',
            'Prakarya Sem 1',
            'B. Sunda Sem 1',
            'Geografi Sem 1',
            'Sejarah Sem 1',
            'Sosiologi Sem 1',
            'Ekonomi Sem 1',
            'B. Arab Sem 1',
            'Ilmu Akhlak Sem 1',
            
            // Nilai Akademik Semester 2
            'PABP Sem 2',
            'PPKN Sem 2',
            'B. Indonesia Sem 2',
            'Matematika Sem 2',
            'Sejarah Indonesia Sem 2',
            'B. Inggris Sem 2',
            'Seni Budaya Sem 2',
            'PJOK Sem 2',
            'Prakarya Sem 2',
            'B. Sunda Sem 2',
            'Geografi Sem 2',
            'Sejarah Sem 2',
            'Sosiologi Sem 2',
            'Ekonomi Sem 2',
            'B. Arab Sem 2',
            'Ilmu Akhlak Sem 2',
            'Tahun Ajaran',
            
            // Survei Minat Bakat
            'Mata Pelajaran Diminati',
            'Alasan Minat Mapel',
            'Rencana Kuliah',
            'Jurusan Diminati',
            'Alasan Pilih Jurusan',
            'Kategori Jurusan',
            'Tahu Universitas',
            'Ekstrakurikuler',
            'Ekstrakurikuler Pengaruh',
            'Pengaruh Keputusan',
            'Pernah Tes Minat',
            'Tingkat Keyakinan',
        ];
    }

    /**
     * Map data for each row
     */
    public function map($siswa): array
    {
        $nilai = $siswa->nilaiAkademik->first();
        $survei = $siswa->surveiMinatBakat;
        
        return [
            // Data Siswa
            $siswa->nomor_induk,
            $siswa->nisn,
            $siswa->nama_lengkap,
            $siswa->jenis_kelamin,
            $siswa->tempat_lahir,
            $siswa->tanggal_lahir ? $siswa->tanggal_lahir->format('Y-m-d') : '',
            $siswa->agama,
            $siswa->anak_ke,
            $siswa->status_dalam_keluarga,
            $siswa->alamat,
            $siswa->kelas,
            $siswa->tanggal_diterima ? $siswa->tanggal_diterima->format('Y-m-d') : '',
            $siswa->semester_diterima,
            $siswa->asal_sekolah,
            $siswa->alamat_asal_sekolah,
            $siswa->tahun_ijazah,
            $siswa->nomor_ijazah,
            $siswa->tahun_sttb,
            $siswa->nomor_sttb,
            $siswa->nama_ayah,
            $siswa->nama_ibu,
            $siswa->alamat_orang_tua,
            $siswa->pekerjaan_ayah,
            $siswa->pekerjaan_ibu,
            $siswa->nama_wali,
            $siswa->alamat_wali,
            $siswa->pekerjaan_wali,
            $siswa->nomor_telepon_ayah,
            $siswa->nomor_telepon_ibu,
            $siswa->nomor_telepon_wali,
            $siswa->is_aktif ? 'Aktif' : 'Tidak Aktif',
            $siswa->is_alumni ? 'Alumni' : 'Belum Alumni',
            
            // Nilai Akademik Semester 1
            $nilai?->pabp_sem1 ?? '',
            $nilai?->ppkn_sem1 ?? '',
            $nilai?->bahasa_indonesia_sem1 ?? '',
            $nilai?->matematika_wajib_sem1 ?? '',
            $nilai?->sejarah_indonesia_sem1 ?? '',
            $nilai?->bahasa_inggris_sem1 ?? '',
            $nilai?->seni_budaya_sem1 ?? '',
            $nilai?->pjok_sem1 ?? '',
            $nilai?->prakarya_sem1 ?? '',
            $nilai?->bahasa_sunda_sem1 ?? '',
            $nilai?->geografi_sem1 ?? '',
            $nilai?->sejarah_sem1 ?? '',
            $nilai?->sosiologi_sem1 ?? '',
            $nilai?->ekonomi_sem1 ?? '',
            $nilai?->bahasa_arab_sem1 ?? '',
            $nilai?->ilmu_akhlak_sem1 ?? '',
            
            // Nilai Akademik Semester 2
            $nilai?->pabp_sem2 ?? '',
            $nilai?->ppkn_sem2 ?? '',
            $nilai?->bahasa_indonesia_sem2 ?? '',
            $nilai?->matematika_wajib_sem2 ?? '',
            $nilai?->sejarah_indonesia_sem2 ?? '',
            $nilai?->bahasa_inggris_sem2 ?? '',
            $nilai?->seni_budaya_sem2 ?? '',
            $nilai?->pjok_sem2 ?? '',
            $nilai?->prakarya_sem2 ?? '',
            $nilai?->bahasa_sunda_sem2 ?? '',
            $nilai?->geografi_sem2 ?? '',
            $nilai?->sejarah_sem2 ?? '',
            $nilai?->sosiologi_sem2 ?? '',
            $nilai?->ekonomi_sem2 ?? '',
            $nilai?->bahasa_arab_sem2 ?? '',
            $nilai?->ilmu_akhlak_sem2 ?? '',
            $nilai?->tahun_ajaran ?? '',
            
            // Survei Minat Bakat
            is_array($survei?->mata_pelajaran_diminati) ? implode(', ', $survei->mata_pelajaran_diminati) : ($survei?->mata_pelajaran_diminati ?? ''),
            $survei?->alasan_minat_mapel ?? '',
            $survei?->rencana_kuliah ?? '',
            $survei?->jurusan_diminati ?? '',
            $survei?->alasan_pilih_jurusan ?? '',
            $survei?->kategori_jurusan ?? '',
            $survei?->tahu_universitas ?? '',
            $survei?->ekstrakurikuler ?? '',
            $survei?->ekstrakurikuler_pengaruh ?? '',
            $survei?->pengaruh_keputusan ?? '',
            $survei?->pernah_tes_minat ?? '',
            $survei?->tingkat_keyakinan ?? '',
        ];
    }

    /**
     * Style the Excel sheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as header
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
        ];
    }
}