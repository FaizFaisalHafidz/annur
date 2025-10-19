<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SiswaTemplateExport implements FromArray, WithStyles, ShouldAutoSize
{
    /**
     * Return template data with headers and example row
     */
    public function array(): array
    {
        return [
            // Headers
            [
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
            ],
            // Example row
            [
                // Data Siswa
                '2024001',
                '0123456789',
                'Ahmad Fauzi',
                'Laki-laki',
                'Jakarta',
                '2005-01-15',
                'ISLAM',
                '1',
                'ANAK KANDUNG',
                'Jl. Raya No. 123, Jakarta',
                'XII IPA-1',
                '2022-07-15',
                '1',
                'SMP Negeri 1 Jakarta',
                'Jl. Pendidikan No. 45, Jakarta',
                '2022',
                'SMP-001/2022',
                '2022',
                'STTB-001/2022',
                'Budi Santoso',
                'Siti Nurhasanah',
                'Jl. Raya No. 123, Jakarta',
                'Pegawai Swasta',
                'Ibu Rumah Tangga',
                '',
                '',
                '',
                '081234567890',
                '081234567891',
                '',
                'Aktif',
                'Belum Alumni',
                
                // Nilai Akademik Semester 1
                '85', '80', '88', '90', '82', '87', '75', '80', '78', '85',
                '88', '85', '83', '90', '80', '85',
                
                // Nilai Akademik Semester 2
                '87', '82', '90', '92', '84', '89', '77', '82', '80', '87',
                '90', '87', '85', '92', '82', '87',
                '2023/2024',
                
                // Survei Minat Bakat
                'Matematika, Fisika, Kimia',
                'Suka dengan hitungan dan eksperimen',
                'Iya',
                'Teknik Informatika',
                'Sesuai dengan minat di teknologi',
                'Teknik',
                'Ya',
                'Robotika',
                'Sangat membantu',
                'Orang tua dan guru',
                'Ya',
                '4',
            ],
        ];
    }

    /**
     * Style the Excel template
     */
    public function styles(Worksheet $sheet)
    {
        // Set header style for data siswa (columns A-AF)
        $sheet->getStyle('A1:AF1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1F2937'], // Dark gray for siswa data
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Set header style for nilai akademik (columns AG-BA)
        $sheet->getStyle('AG1:BA1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '059669'], // Green for nilai
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Set header style for survei minat bakat (columns BB-BM)
        $sheet->getStyle('BB1:BM1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'DC2626'], // Red for survei
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Set example row style
        $sheet->getStyle('A2:BM2')->applyFromArray([
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'F9FAFB'],
            ],
        ]);

        // Set row height
        $sheet->getRowDimension(1)->setRowHeight(25);
        $sheet->getRowDimension(2)->setRowHeight(20);

        // Add instruction comment to first cell
        $sheet->getComment('A1')->getText()->createTextRun(
            "TEMPLATE IMPORT DATA SISWA LENGKAP\n\n" .
            "PETUNJUK PENGISIAN:\n" .
            "1. Isi data siswa mulai dari baris ke-3\n" .
            "2. JANGAN ubah header di baris pertama\n" .
            "3. Format tanggal: YYYY-MM-DD (contoh: 2005-01-15)\n" .
            "4. Jenis Kelamin: Laki-laki atau Perempuan\n" .
            "5. Status Aktif: Aktif atau Tidak Aktif\n" .
            "6. Status Alumni: Alumni atau Belum Alumni\n" .
            "7. Nilai: isi dengan angka 0-100 (kosongkan jika tidak ada)\n" .
            "8. Mata Pelajaran Diminati: pisahkan dengan koma\n" .
            "9. Tingkat Keyakinan: angka 1-5\n" .
            "10. Hapus baris contoh (baris ke-2) sebelum import\n\n" .
            "WARNA HEADER:\n" .
            "- Abu-abu: Data Siswa (wajib)\n" .
            "- Hijau: Nilai Akademik (opsional)\n" .
            "- Merah: Survei Minat Bakat (opsional)\n\n" .
            "KOLOM WAJIB: Nomor Induk, Nama Lengkap, Jenis Kelamin, Kelas"
        );

        return [];
    }
}