<?php

namespace App\Imports;

use App\Models\SiswaLengkap;
use App\Models\NilaiAkademik;
use App\Models\SurveiMinatBakat;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;

class SiswaImport implements ToCollection, WithHeadingRow, WithValidation
{
    protected $errors = [];
    protected $successCount = 0;

    /**
     * Process the collection from Excel
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            try {
                // Skip empty rows
                if (empty($row['nomor_induk']) && empty($row['nama_lengkap'])) {
                    continue;
                }

                // Convert tanggal lahir dan tanggal diterima
                $tanggalLahir = $this->parseDate($row['tanggal_lahir']);
                $tanggalDiterima = $this->parseDate($row['tanggal_diterima']);

                // Parse status boolean
                $isAktif = $this->parseBoolean($row['status_aktif'] ?? 'Aktif');
                $isAlumni = $this->parseBoolean($row['status_alumni'] ?? 'Belum Alumni');

                $siswaData = [
                    'nomor_induk' => $row['nomor_induk'],
                    'nisn' => $row['nisn'],
                    'nama_lengkap' => $row['nama_lengkap'],
                    'jenis_kelamin' => $row['jenis_kelamin'],
                    'tempat_lahir' => $row['tempat_lahir'],
                    'tanggal_lahir' => $tanggalLahir,
                    'agama' => $row['agama'] ?? 'ISLAM',
                    'anak_ke' => (int) ($row['anak_ke'] ?? 1),
                    'status_dalam_keluarga' => $row['status_dalam_keluarga'] ?? 'ANAK KANDUNG',
                    'alamat' => $row['alamat'],
                    'kelas' => $row['kelas'],
                    'tanggal_diterima' => $tanggalDiterima,
                    'semester_diterima' => (int) ($row['semester_diterima'] ?? 1),
                    'asal_sekolah' => $row['asal_sekolah'],
                    'alamat_asal_sekolah' => $row['alamat_asal_sekolah'],
                    'tahun_ijazah' => $row['tahun_ijazah'],
                    'nomor_ijazah' => $row['nomor_ijazah'],
                    'tahun_sttb' => $row['tahun_sttb'],
                    'nomor_sttb' => $row['nomor_sttb'],
                    'nama_ayah' => $row['nama_ayah'],
                    'nama_ibu' => $row['nama_ibu'],
                    'alamat_orang_tua' => $row['alamat_orang_tua'],
                    'pekerjaan_ayah' => $row['pekerjaan_ayah'],
                    'pekerjaan_ibu' => $row['pekerjaan_ibu'],
                    'nama_wali' => $row['nama_wali'],
                    'alamat_wali' => $row['alamat_wali'],
                    'pekerjaan_wali' => $row['pekerjaan_wali'],
                    'nomor_telepon_ayah' => $row['no_telepon_ayah'],
                    'nomor_telepon_ibu' => $row['no_telepon_ibu'],
                    'nomor_telepon_wali' => $row['no_telepon_wali'],
                    'is_aktif' => $isAktif,
                    'is_alumni' => $isAlumni,
                ];

                // Create or update siswa
                $siswa = SiswaLengkap::updateOrCreate(
                    ['nomor_induk' => $siswaData['nomor_induk']],
                    $siswaData
                );

                // Process nilai akademik if available
                $this->processNilaiAkademik($row, $siswa->id);

                // Process survei minat bakat if available
                $this->processSurveiMinatBakat($row, $siswa->id);

                $this->successCount++;

            } catch (\Exception $e) {
                $this->errors[] = [
                    'row' => $index + 2, // +2 because of header row and 0-based index
                    'error' => $e->getMessage()
                ];
            }
        }
    }

    /**
     * Parse date from various formats
     */
    private function parseDate($date)
    {
        if (empty($date)) {
            return null;
        }

        // If it's already a Carbon instance
        if ($date instanceof Carbon) {
            return $date->format('Y-m-d');
        }

        // If it's a numeric timestamp from Excel
        if (is_numeric($date)) {
            return Carbon::createFromFormat('Y-m-d', '1900-01-01')
                ->addDays($date - 2)
                ->format('Y-m-d');
        }

        // Try to parse common date formats
        $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y'];
        
        foreach ($formats as $format) {
            try {
                $parsedDate = Carbon::createFromFormat($format, $date);
                if ($parsedDate) {
                    return $parsedDate->format('Y-m-d');
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    /**
     * Parse boolean values from text
     */
    private function parseBoolean($value)
    {
        if (empty($value)) {
            return false;
        }

        $value = strtolower(trim($value));
        
        $trueValues = ['aktif', 'alumni', 'ya', 'yes', 'true', '1'];
        $falseValues = ['tidak aktif', 'belum alumni', 'tidak', 'no', 'false', '0'];

        if (in_array($value, $trueValues)) {
            return true;
        }

        if (in_array($value, $falseValues)) {
            return false;
        }

        return false;
    }

    /**
     * Get validation rules
     */
    public function rules(): array
    {
        return [
            'nomor_induk' => 'required|string',
            'nama_lengkap' => 'required|string',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'kelas' => 'required|string',
        ];
    }

    /**
     * Process nilai akademik data
     */
    private function processNilaiAkademik($row, $siswaId)
    {
        // Nilai akademik fields mapping
        $nilaiFields = [
            'pabp_sem1' => $row['pabp_sem_1'] ?? null,
            'ppkn_sem1' => $row['ppkn_sem_1'] ?? null,
            'bahasa_indonesia_sem1' => $row['b_indonesia_sem_1'] ?? null,
            'matematika_wajib_sem1' => $row['matematika_sem_1'] ?? null,
            'sejarah_indonesia_sem1' => $row['sejarah_indonesia_sem_1'] ?? null,
            'bahasa_inggris_sem1' => $row['b_inggris_sem_1'] ?? null,
            'seni_budaya_sem1' => $row['seni_budaya_sem_1'] ?? null,
            'pjok_sem1' => $row['pjok_sem_1'] ?? null,
            'prakarya_sem1' => $row['prakarya_sem_1'] ?? null,
            'bahasa_sunda_sem1' => $row['b_sunda_sem_1'] ?? null,
            'geografi_sem1' => $row['geografi_sem_1'] ?? null,
            'sejarah_sem1' => $row['sejarah_sem_1'] ?? null,
            'sosiologi_sem1' => $row['sosiologi_sem_1'] ?? null,
            'ekonomi_sem1' => $row['ekonomi_sem_1'] ?? null,
            'bahasa_arab_sem1' => $row['b_arab_sem_1'] ?? null,
            'ilmu_akhlak_sem1' => $row['ilmu_akhlak_sem_1'] ?? null,
            
            'pabp_sem2' => $row['pabp_sem_2'] ?? null,
            'ppkn_sem2' => $row['ppkn_sem_2'] ?? null,
            'bahasa_indonesia_sem2' => $row['b_indonesia_sem_2'] ?? null,
            'matematika_wajib_sem2' => $row['matematika_sem_2'] ?? null,
            'sejarah_indonesia_sem2' => $row['sejarah_indonesia_sem_2'] ?? null,
            'bahasa_inggris_sem2' => $row['b_inggris_sem_2'] ?? null,
            'seni_budaya_sem2' => $row['seni_budaya_sem_2'] ?? null,
            'pjok_sem2' => $row['pjok_sem_2'] ?? null,
            'prakarya_sem2' => $row['prakarya_sem_2'] ?? null,
            'bahasa_sunda_sem2' => $row['b_sunda_sem_2'] ?? null,
            'geografi_sem2' => $row['geografi_sem_2'] ?? null,
            'sejarah_sem2' => $row['sejarah_sem_2'] ?? null,
            'sosiologi_sem2' => $row['sosiologi_sem_2'] ?? null,
            'ekonomi_sem2' => $row['ekonomi_sem_2'] ?? null,
            'bahasa_arab_sem2' => $row['b_arab_sem_2'] ?? null,
            'ilmu_akhlak_sem2' => $row['ilmu_akhlak_sem_2'] ?? null,
        ];

        // Filter out empty values and convert to integer
        $nilaiData = collect($nilaiFields)->filter(function($value) {
            return !empty($value) && is_numeric($value) && $value > 0;
        })->map(function($value) {
            return (int) $value;
        })->toArray();

        if (!empty($nilaiData)) {
            $nilaiData['siswa_lengkap_id'] = $siswaId;
            $nilaiData['tahun_ajaran'] = $row['tahun_ajaran'] ?? '2023/2024';
            $nilaiData['kelas'] = $row['kelas'] ?? '';
            
            // Calculate totals and averages
            $sem1Values = collect($nilaiData)->filter(fn($val, $key) => str_ends_with($key, '_sem1'))->values();
            $sem2Values = collect($nilaiData)->filter(fn($val, $key) => str_ends_with($key, '_sem2'))->values();
            
            if ($sem1Values->count() > 0) {
                $nilaiData['total_sem1'] = $sem1Values->sum();
                $nilaiData['rata_rata_sem1'] = $sem1Values->avg();
            }
            
            if ($sem2Values->count() > 0) {
                $nilaiData['total_sem2'] = $sem2Values->sum();
                $nilaiData['rata_rata_sem2'] = $sem2Values->avg();
            }
            
            if (isset($nilaiData['rata_rata_sem1']) && isset($nilaiData['rata_rata_sem2'])) {
                $nilaiData['total_keseluruhan'] = ($nilaiData['total_sem1'] ?? 0) + ($nilaiData['total_sem2'] ?? 0);
                $nilaiData['rata_rata_keseluruhan'] = ($nilaiData['rata_rata_sem1'] + $nilaiData['rata_rata_sem2']) / 2;
            }

            NilaiAkademik::updateOrCreate(
                ['siswa_lengkap_id' => $siswaId],
                $nilaiData
            );
        }
    }

    /**
     * Process survei minat bakat data
     */
    private function processSurveiMinatBakat($row, $siswaId)
    {
        $surveiData = [
            'mata_pelajaran_diminati' => !empty($row['mata_pelajaran_diminati']) 
                ? (is_string($row['mata_pelajaran_diminati']) 
                    ? explode(', ', $row['mata_pelajaran_diminati']) 
                    : $row['mata_pelajaran_diminati']) 
                : null,
            'alasan_minat_mapel' => $row['alasan_minat_mapel'] ?? null,
            'rencana_kuliah' => $row['rencana_kuliah'] ?? null,
            'jurusan_diminati' => $row['jurusan_diminati'] ?? null,
            'alasan_pilih_jurusan' => $row['alasan_pilih_jurusan'] ?? null,
            'kategori_jurusan' => $row['kategori_jurusan'] ?? null,
            'tahu_universitas' => $row['tahu_universitas'] ?? null,
            'ekstrakurikuler' => $row['ekstrakurikuler'] ?? null,
            'ekstrakurikuler_pengaruh' => $row['ekstrakurikuler_pengaruh'] ?? null,
            'pengaruh_keputusan' => $row['pengaruh_keputusan'] ?? null,
            'pernah_tes_minat' => $row['pernah_tes_minat'] ?? null,
            'tingkat_keyakinan' => !empty($row['tingkat_keyakinan']) && is_numeric($row['tingkat_keyakinan']) 
                ? (int) $row['tingkat_keyakinan'] 
                : null,
        ];

        // Filter out empty values
        $surveiData = array_filter($surveiData, function($value) {
            return !is_null($value) && $value !== '';
        });

        if (!empty($surveiData)) {
            $surveiData['siswa_lengkap_id'] = $siswaId;
            $surveiData['tanggal_survei'] = now();
            
            SurveiMinatBakat::updateOrCreate(
                ['siswa_lengkap_id' => $siswaId],
                $surveiData
            );
        }
    }

    /**
     * Get import results
     */
    public function getResults()
    {
        return [
            'success_count' => $this->successCount,
            'errors' => $this->errors,
            'total_errors' => count($this->errors),
        ];
    }
}