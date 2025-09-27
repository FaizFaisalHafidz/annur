<?php

namespace App\Http\Controllers;

use App\Models\SiswaLengkap;
use App\Models\NilaiAkademik;
use App\Models\SurveiMinatBakat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiswaLengkapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siswa = SiswaLengkap::with(['nilaiAkademik', 'surveiMinatBakat'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate statistics
        $stats = [
            'total_siswa' => $siswa->count(),
            'laki_laki' => $siswa->where('jenis_kelamin', 'Laki-laki')->count(),
            'perempuan' => $siswa->where('jenis_kelamin', 'Perempuan')->count(),
            'aktif' => $siswa->where('is_aktif', true)->count(),
            'alumni' => $siswa->where('is_alumni', true)->count(),
            'rencana_kuliah' => [
                'iya' => $siswa->filter(function($s) {
                    return $s->surveiMinatBakat && $s->surveiMinatBakat->rencana_kuliah === 'Iya';
                })->count(),
                'tidak' => $siswa->filter(function($s) {
                    return $s->surveiMinatBakat && $s->surveiMinatBakat->rencana_kuliah === 'Tidak';
                })->count(),
                'masih_ragu' => $siswa->filter(function($s) {
                    return $s->surveiMinatBakat && $s->surveiMinatBakat->rencana_kuliah === 'Masih ragu';
                })->count(),
            ],
        ];

        return Inertia::render('siswa/index', [
            'siswa' => [
                'data' => $siswa->values(),
                'meta' => [
                    'total' => $siswa->count(),
                    'per_page' => 10,
                    'current_page' => 1,
                    'last_page' => ceil($siswa->count() / 10),
                ]
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('siswa/create', [
            'kelasList' => [
                'X IPA-1', 'X IPA-2', 'X IPS-1', 'X IPS-2',
                'XI IPA-1', 'XI IPA-2', 'XI IPS-1', 'XI IPS-2',
                'XII IPA-1', 'XII IPA-2', 'XII IPS-1', 'XII IPS-2',
            ],
            'agamaList' => ['ISLAM', 'KRISTEN', 'KATHOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_induk' => 'required|string|max:255|unique:siswa_lengkap',
            'nisn' => 'required|string|max:255|unique:siswa_lengkap',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:255',
            'anak_ke' => 'required|integer|min:1',
            'status_dalam_keluarga' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'kelas' => 'required|string|max:255',
            'tanggal_diterima' => 'required|date',
            'semester_diterima' => 'required|integer|min:1|max:2',
            'asal_sekolah' => 'nullable|string|max:255',
            'alamat_asal_sekolah' => 'nullable|string',
            'tahun_ijazah' => 'nullable|string|max:4',
            'nomor_ijazah' => 'nullable|string|max:255',
            'tahun_sttb' => 'nullable|string|max:4',
            'nomor_sttb' => 'nullable|string|max:255',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'alamat_orang_tua' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'nama_wali' => 'nullable|string|max:255',
            'alamat_wali' => 'nullable|string',
            'pekerjaan_wali' => 'nullable|string|max:255',
            'nomor_telepon_ayah' => 'nullable|string|max:20',
            'nomor_telepon_ibu' => 'nullable|string|max:20',
            'nomor_telepon_wali' => 'nullable|string|max:20',
            
            // Validasi nilai akademik
            'pabp_sem1' => 'nullable|integer|min:0|max:100',
            'ppkn_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_indonesia_sem1' => 'nullable|integer|min:0|max:100',
            'matematika_wajib_sem1' => 'nullable|integer|min:0|max:100',
            'sejarah_indonesia_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_inggris_sem1' => 'nullable|integer|min:0|max:100',
            'seni_budaya_sem1' => 'nullable|integer|min:0|max:100',
            'pjok_sem1' => 'nullable|integer|min:0|max:100',
            'prakarya_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_sunda_sem1' => 'nullable|integer|min:0|max:100',
            'geografi_sem1' => 'nullable|integer|min:0|max:100',
            'sejarah_sem1' => 'nullable|integer|min:0|max:100',
            'sosiologi_sem1' => 'nullable|integer|min:0|max:100',
            'ekonomi_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_arab_sem1' => 'nullable|integer|min:0|max:100',
            'ilmu_akhlak_sem1' => 'nullable|integer|min:0|max:100',
            'pabp_sem2' => 'nullable|integer|min:0|max:100',
            'ppkn_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_indonesia_sem2' => 'nullable|integer|min:0|max:100',
            'matematika_wajib_sem2' => 'nullable|integer|min:0|max:100',
            'sejarah_indonesia_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_inggris_sem2' => 'nullable|integer|min:0|max:100',
            'seni_budaya_sem2' => 'nullable|integer|min:0|max:100',
            'pjok_sem2' => 'nullable|integer|min:0|max:100',
            'prakarya_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_sunda_sem2' => 'nullable|integer|min:0|max:100',
            'geografi_sem2' => 'nullable|integer|min:0|max:100',
            'sejarah_sem2' => 'nullable|integer|min:0|max:100',
            'sosiologi_sem2' => 'nullable|integer|min:0|max:100',
            'ekonomi_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_arab_sem2' => 'nullable|integer|min:0|max:100',
            'ilmu_akhlak_sem2' => 'nullable|integer|min:0|max:100',
            'tahun_ajaran' => 'nullable|string',
            
            // Validasi survei minat bakat
            'mata_pelajaran_diminati' => 'nullable|array',
            'alasan_minat_mapel' => 'nullable|string',
            'rencana_kuliah' => 'nullable|string',
            'jurusan_diminati' => 'nullable|string',
            'alasan_pilih_jurusan' => 'nullable|string',
            'kategori_jurusan' => 'nullable|string',
            'tahu_universitas' => 'nullable|string',
            'ekstrakurikuler' => 'nullable|string',
            'ekstrakurikuler_pengaruh' => 'nullable|string',
            'pengaruh_keputusan' => 'nullable|string',
            'pernah_tes_minat' => 'nullable|string',
            'tingkat_keyakinan' => 'nullable|integer|min:1|max:5',
        ]);

        // Buat data siswa
        $siswaData = collect($validated)->only([
            'nomor_induk', 'nisn', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
            'agama', 'anak_ke', 'status_dalam_keluarga', 'alamat', 'kelas', 'tanggal_diterima',
            'semester_diterima', 'asal_sekolah', 'alamat_asal_sekolah', 'tahun_ijazah', 'nomor_ijazah',
            'tahun_sttb', 'nomor_sttb', 'nama_ayah', 'nama_ibu', 'alamat_orang_tua', 'pekerjaan_ayah',
            'pekerjaan_ibu', 'nama_wali', 'alamat_wali', 'pekerjaan_wali', 'nomor_telepon_ayah',
            'nomor_telepon_ibu', 'nomor_telepon_wali'
        ])->toArray();

        $siswa = SiswaLengkap::create($siswaData);

        // Buat data nilai akademik jika ada
        $nilaiFields = [
            'pabp_sem1', 'ppkn_sem1', 'bahasa_indonesia_sem1', 'matematika_wajib_sem1', 'sejarah_indonesia_sem1',
            'bahasa_inggris_sem1', 'seni_budaya_sem1', 'pjok_sem1', 'prakarya_sem1', 'bahasa_sunda_sem1',
            'geografi_sem1', 'sejarah_sem1', 'sosiologi_sem1', 'ekonomi_sem1', 'bahasa_arab_sem1', 'ilmu_akhlak_sem1',
            'pabp_sem2', 'ppkn_sem2', 'bahasa_indonesia_sem2', 'matematika_wajib_sem2', 'sejarah_indonesia_sem2',
            'bahasa_inggris_sem2', 'seni_budaya_sem2', 'pjok_sem2', 'prakarya_sem2', 'bahasa_sunda_sem2',
            'geografi_sem2', 'sejarah_sem2', 'sosiologi_sem2', 'ekonomi_sem2', 'bahasa_arab_sem2', 'ilmu_akhlak_sem2'
        ];

        $nilaiData = collect($validated)->only($nilaiFields)->filter(function($value) {
            return $value > 0;
        });

        if ($nilaiData->isNotEmpty()) {
            $nilaiAkademik = $nilaiData->toArray();
            $nilaiAkademik['siswa_lengkap_id'] = $siswa->id;
            $nilaiAkademik['tahun_ajaran'] = $validated['tahun_ajaran'] ?? '2022/2023';
            $nilaiAkademik['kelas'] = $siswa->kelas;
            
            // Hitung total dan rata-rata
            $sem1Values = collect($nilaiAkademik)->filter(fn($key, $val) => str_ends_with($key, '_sem1'))->values();
            $sem2Values = collect($nilaiAkademik)->filter(fn($key, $val) => str_ends_with($key, '_sem2'))->values();
            
            $nilaiAkademik['total_sem1'] = $sem1Values->sum();
            $nilaiAkademik['total_sem2'] = $sem2Values->sum();
            $nilaiAkademik['total_keseluruhan'] = $nilaiAkademik['total_sem1'] + $nilaiAkademik['total_sem2'];
            $nilaiAkademik['rata_rata_sem1'] = $sem1Values->count() > 0 ? $sem1Values->avg() : 0;
            $nilaiAkademik['rata_rata_sem2'] = $sem2Values->count() > 0 ? $sem2Values->avg() : 0;
            $nilaiAkademik['rata_rata_keseluruhan'] = ($nilaiAkademik['rata_rata_sem1'] + $nilaiAkademik['rata_rata_sem2']) / 2;

            NilaiAkademik::create($nilaiAkademik);
        }

        // Buat data survei minat bakat jika ada
        $surveiFields = [
            'mata_pelajaran_diminati', 'alasan_minat_mapel', 'rencana_kuliah', 'jurusan_diminati',
            'alasan_pilih_jurusan', 'kategori_jurusan', 'tahu_universitas', 'ekstrakurikuler',
            'ekstrakurikuler_pengaruh', 'pengaruh_keputusan', 'pernah_tes_minat', 'tingkat_keyakinan'
        ];

        $surveiData = collect($validated)->only($surveiFields)->filter()->toArray();

        if (!empty($surveiData)) {
            $surveiData['siswa_lengkap_id'] = $siswa->id;
            $surveiData['tanggal_survei'] = now();
            
            SurveiMinatBakat::create($surveiData);
        }

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(SiswaLengkap $siswa)
    {
        $siswa->load(['nilaiAkademik', 'surveiMinatBakat', 'prediksiJurusan']);
        
        return Inertia::render('siswa/show', [
            'siswa' => $siswa
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SiswaLengkap $siswa)
    {
        $siswa->load(['nilaiAkademik', 'surveiMinatBakat']);
        
        return Inertia::render('siswa/edit', [
            'siswa' => $siswa,
            'nilaiAkademik' => $siswa->nilaiAkademik,
            'surveiMinatBakat' => $siswa->surveiMinatBakat,
            'kelasList' => [
                'X IPA-1', 'X IPA-2', 'X IPS-1', 'X IPS-2',
                'XI IPA-1', 'XI IPA-2', 'XI IPS-1', 'XI IPS-2',
                'XII IPA-1', 'XII IPA-2', 'XII IPS-1', 'XII IPS-2',
            ],
            'agamaList' => ['ISLAM', 'KRISTEN', 'KATHOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SiswaLengkap $siswa)
    {
        $validated = $request->validate([
            'nomor_induk' => 'required|string|unique:siswa_lengkap,nomor_induk,' . $siswa->id,
            'nisn' => 'required|string|unique:siswa_lengkap,nisn,' . $siswa->id,
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:50',
            'anak_ke' => 'nullable|integer|min:1',
            'status_dalam_keluarga' => 'required|string|max:50',
            'alamat' => 'nullable|string',
            'kelas' => 'required|string|max:20',
            'tanggal_diterima' => 'required|date',
            'semester_diterima' => 'required|integer|min:1|max:2',
            'asal_sekolah' => 'nullable|string|max:255',
            'alamat_asal_sekolah' => 'nullable|string',
            'tahun_ijazah' => 'nullable|string|max:10',
            'nomor_ijazah' => 'nullable|string|max:100',
            'tahun_sttb' => 'nullable|string|max:10',
            'nomor_sttb' => 'nullable|string|max:100',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'alamat_orang_tua' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'nama_wali' => 'nullable|string|max:255',
            'alamat_wali' => 'nullable|string',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'nomor_telepon_ayah' => 'nullable|string|max:20',
            'nomor_telepon_ibu' => 'nullable|string|max:20',
            'nomor_telepon_wali' => 'nullable|string|max:20',
            
            // Validasi nilai akademik
            'pabp_sem1' => 'nullable|integer|min:0|max:100',
            'ppkn_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_indonesia_sem1' => 'nullable|integer|min:0|max:100',
            'matematika_wajib_sem1' => 'nullable|integer|min:0|max:100',
            'sejarah_indonesia_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_inggris_sem1' => 'nullable|integer|min:0|max:100',
            'seni_budaya_sem1' => 'nullable|integer|min:0|max:100',
            'pjok_sem1' => 'nullable|integer|min:0|max:100',
            'prakarya_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_sunda_sem1' => 'nullable|integer|min:0|max:100',
            'geografi_sem1' => 'nullable|integer|min:0|max:100',
            'sejarah_sem1' => 'nullable|integer|min:0|max:100',
            'sosiologi_sem1' => 'nullable|integer|min:0|max:100',
            'ekonomi_sem1' => 'nullable|integer|min:0|max:100',
            'bahasa_arab_sem1' => 'nullable|integer|min:0|max:100',
            'ilmu_akhlak_sem1' => 'nullable|integer|min:0|max:100',
            'pabp_sem2' => 'nullable|integer|min:0|max:100',
            'ppkn_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_indonesia_sem2' => 'nullable|integer|min:0|max:100',
            'matematika_wajib_sem2' => 'nullable|integer|min:0|max:100',
            'sejarah_indonesia_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_inggris_sem2' => 'nullable|integer|min:0|max:100',
            'seni_budaya_sem2' => 'nullable|integer|min:0|max:100',
            'pjok_sem2' => 'nullable|integer|min:0|max:100',
            'prakarya_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_sunda_sem2' => 'nullable|integer|min:0|max:100',
            'geografi_sem2' => 'nullable|integer|min:0|max:100',
            'sejarah_sem2' => 'nullable|integer|min:0|max:100',
            'sosiologi_sem2' => 'nullable|integer|min:0|max:100',
            'ekonomi_sem2' => 'nullable|integer|min:0|max:100',
            'bahasa_arab_sem2' => 'nullable|integer|min:0|max:100',
            'ilmu_akhlak_sem2' => 'nullable|integer|min:0|max:100',
            'tahun_ajaran' => 'nullable|string',
            
            // Validasi survei minat bakat
            'mata_pelajaran_diminati' => 'nullable|array',
            'alasan_minat_mapel' => 'nullable|string',
            'rencana_kuliah' => 'nullable|string',
            'jurusan_diminati' => 'nullable|string',
            'alasan_pilih_jurusan' => 'nullable|string',
            'kategori_jurusan' => 'nullable|string',
            'tahu_universitas' => 'nullable|string',
            'ekstrakurikuler' => 'nullable|string',
            'ekstrakurikuler_pengaruh' => 'nullable|string',
            'pengaruh_keputusan' => 'nullable|string',
            'pernah_tes_minat' => 'nullable|string',
            'tingkat_keyakinan' => 'nullable|integer|min:1|max:5',
        ]);

        // Update data siswa
        $siswaData = collect($validated)->only([
            'nomor_induk', 'nisn', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
            'agama', 'anak_ke', 'status_dalam_keluarga', 'alamat', 'kelas', 'tanggal_diterima',
            'semester_diterima', 'asal_sekolah', 'alamat_asal_sekolah', 'tahun_ijazah', 'nomor_ijazah',
            'tahun_sttb', 'nomor_sttb', 'nama_ayah', 'nama_ibu', 'alamat_orang_tua', 'pekerjaan_ayah',
            'pekerjaan_ibu', 'nama_wali', 'alamat_wali', 'pekerjaan_wali', 'nomor_telepon_ayah',
            'nomor_telepon_ibu', 'nomor_telepon_wali'
        ])->toArray();

        $siswa->update($siswaData);

        // Update data nilai akademik
        $nilaiFields = [
            'pabp_sem1', 'ppkn_sem1', 'bahasa_indonesia_sem1', 'matematika_wajib_sem1', 'sejarah_indonesia_sem1',
            'bahasa_inggris_sem1', 'seni_budaya_sem1', 'pjok_sem1', 'prakarya_sem1', 'bahasa_sunda_sem1',
            'geografi_sem1', 'sejarah_sem1', 'sosiologi_sem1', 'ekonomi_sem1', 'bahasa_arab_sem1', 'ilmu_akhlak_sem1',
            'pabp_sem2', 'ppkn_sem2', 'bahasa_indonesia_sem2', 'matematika_wajib_sem2', 'sejarah_indonesia_sem2',
            'bahasa_inggris_sem2', 'seni_budaya_sem2', 'pjok_sem2', 'prakarya_sem2', 'bahasa_sunda_sem2',
            'geografi_sem2', 'sejarah_sem2', 'sosiologi_sem2', 'ekonomi_sem2', 'bahasa_arab_sem2', 'ilmu_akhlak_sem2'
        ];

        $nilaiData = collect($validated)->only($nilaiFields)->filter(function($value) {
            return $value > 0;
        });

        if ($nilaiData->isNotEmpty()) {
            $nilaiAkademik = $nilaiData->toArray();
            $nilaiAkademik['tahun_ajaran'] = $validated['tahun_ajaran'] ?? '2022/2023';
            $nilaiAkademik['kelas'] = $siswa->kelas;
            
            // Hitung total dan rata-rata
            $sem1Values = collect($nilaiAkademik)->filter(fn($val, $key) => str_ends_with($key, '_sem1'))->values();
            $sem2Values = collect($nilaiAkademik)->filter(fn($val, $key) => str_ends_with($key, '_sem2'))->values();
            
            $nilaiAkademik['total_sem1'] = $sem1Values->sum();
            $nilaiAkademik['total_sem2'] = $sem2Values->sum();
            $nilaiAkademik['total_keseluruhan'] = $nilaiAkademik['total_sem1'] + $nilaiAkademik['total_sem2'];
            $nilaiAkademik['rata_rata_sem1'] = $sem1Values->count() > 0 ? $sem1Values->avg() : 0;
            $nilaiAkademik['rata_rata_sem2'] = $sem2Values->count() > 0 ? $sem2Values->avg() : 0;
            $nilaiAkademik['rata_rata_keseluruhan'] = ($nilaiAkademik['rata_rata_sem1'] + $nilaiAkademik['rata_rata_sem2']) / 2;

            NilaiAkademik::updateOrCreate(
                ['siswa_lengkap_id' => $siswa->id],
                $nilaiAkademik
            );
        }

        // Update data survei minat bakat
        $surveiFields = [
            'mata_pelajaran_diminati', 'alasan_minat_mapel', 'rencana_kuliah', 'jurusan_diminati',
            'alasan_pilih_jurusan', 'kategori_jurusan', 'tahu_universitas', 'ekstrakurikuler',
            'ekstrakurikuler_pengaruh', 'pengaruh_keputusan', 'pernah_tes_minat', 'tingkat_keyakinan'
        ];

        $surveiData = collect($validated)->only($surveiFields)->filter()->toArray();

        if (!empty($surveiData)) {
            $surveiData['tanggal_survei'] = now();
            
            SurveiMinatBakat::updateOrCreate(
                ['siswa_lengkap_id' => $siswa->id],
                $surveiData
            );
        }

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SiswaLengkap $siswa)
    {
        $nama = $siswa->nama_lengkap;
        $siswa->delete();

        return redirect()->route('siswa.index')
            ->with('success', "Data siswa {$nama} berhasil dihapus.");
    }
}
