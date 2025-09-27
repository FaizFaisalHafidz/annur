<?php

namespace App\Http\Controllers;

use App\Models\SiswaLengkap;
use App\Models\NilaiAkademik;
use App\Models\SurveiMinatBakat;
use App\Models\PrediksiJurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    /**
     * Display laporan dashboard
     */
    public function index()
    {
        // Statistik umum
        $totalSiswa = SiswaLengkap::count();
        $totalSiswaAktif = SiswaLengkap::where('is_aktif', true)->count();
        $totalPrediksi = PrediksiJurusan::count();
        $totalNilai = NilaiAkademik::count();
        $totalSurvei = SurveiMinatBakat::count();

        // Distribusi per kelas
        $distribusiKelas = SiswaLengkap::select('kelas', DB::raw('count(*) as total'))
            ->groupBy('kelas')
            ->orderBy('kelas')
            ->get();

        // Distribusi jenis kelamin
        $distribusiGender = SiswaLengkap::select('jenis_kelamin', DB::raw('count(*) as total'))
            ->groupBy('jenis_kelamin')
            ->get();

        // Prediksi jurusan terpopuler
        $prediksiPopuler = PrediksiJurusan::select('jurusan_prediksi', DB::raw('count(*) as total'))
            ->groupBy('jurusan_prediksi')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // Rata-rata nilai per mata pelajaran semester 1
        $rataNilaiSem1 = NilaiAkademik::selectRaw('
            AVG(pabp_sem1) as avg_pabp,
            AVG(ppkn_sem1) as avg_ppkn,
            AVG(bahasa_indonesia_sem1) as avg_bahasa_indonesia,
            AVG(matematika_wajib_sem1) as avg_matematika,
            AVG(sejarah_indonesia_sem1) as avg_sejarah_indonesia,
            AVG(bahasa_inggris_sem1) as avg_bahasa_inggris,
            AVG(seni_budaya_sem1) as avg_seni_budaya,
            AVG(pjok_sem1) as avg_pjok,
            AVG(prakarya_sem1) as avg_prakarya,
            AVG(bahasa_sunda_sem1) as avg_bahasa_sunda,
            AVG(geografi_sem1) as avg_geografi,
            AVG(sejarah_sem1) as avg_sejarah,
            AVG(sosiologi_sem1) as avg_sosiologi,
            AVG(ekonomi_sem1) as avg_ekonomi,
            AVG(bahasa_arab_sem1) as avg_bahasa_arab,
            AVG(ilmu_akhlak_sem1) as avg_ilmu_akhlak
        ')->first();

        // Minat bakat terpopuler
        $minatPopuler = SurveiMinatBakat::select('kategori_jurusan', DB::raw('count(*) as total'))
            ->whereNotNull('kategori_jurusan')
            ->groupBy('kategori_jurusan')
            ->orderBy('total', 'desc')
            ->get();

        return Inertia::render('laporan/index', [
            'statistik' => [
                'totalSiswa' => $totalSiswa,
                'totalSiswaAktif' => $totalSiswaAktif,
                'totalPrediksi' => $totalPrediksi,
                'totalNilai' => $totalNilai,
                'totalSurvei' => $totalSurvei,
            ],
            'distribusiKelas' => $distribusiKelas,
            'distribusiGender' => $distribusiGender,
            'prediksiPopuler' => $prediksiPopuler,
            'rataNilaiSem1' => $rataNilaiSem1,
            'minatPopuler' => $minatPopuler,
        ]);
    }

    /**
     * Laporan siswa lengkap
     */
    public function siswa(Request $request)
    {
        $query = SiswaLengkap::with(['nilaiAkademik', 'surveiMinatBakat', 'prediksiJurusan']);

        // Filter berdasarkan kelas
        if ($request->kelas && $request->kelas !== 'semua') {
            $query->where('kelas', $request->kelas);
        }

        // Filter berdasarkan status aktif
        if ($request->status && $request->status !== 'semua') {
            $query->where('is_aktif', $request->status === 'aktif');
        }

        // Filter berdasarkan jenis kelamin
        if ($request->gender && $request->gender !== 'semua') {
            $query->where('jenis_kelamin', $request->gender);
        }

        $siswa = $query->orderBy('nama_lengkap')->paginate(20);

        $kelasList = SiswaLengkap::distinct('kelas')->pluck('kelas')->sort()->values();

        return Inertia::render('laporan/siswa', [
            'siswa' => $siswa,
            'kelasList' => $kelasList,
            'filters' => $request->only(['kelas', 'status', 'gender']),
        ]);
    }

    /**
     * Laporan nilai akademik
     */
    public function nilai(Request $request)
    {
        $query = NilaiAkademik::with('siswaLengkap');

        // Filter berdasarkan kelas
        if ($request->kelas && $request->kelas !== 'semua') {
            $query->whereHas('siswaLengkap', function($q) use ($request) {
                $q->where('kelas', $request->kelas);
            });
        }

        // Filter berdasarkan tahun ajaran
        if ($request->tahun_ajaran && $request->tahun_ajaran !== 'semua') {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        $nilai = $query->orderBy('rata_rata_keseluruhan', 'desc')->paginate(20);

        $kelasList = SiswaLengkap::distinct('kelas')->pluck('kelas')->sort()->values();
        $tahunAjaranList = NilaiAkademik::distinct('tahun_ajaran')->pluck('tahun_ajaran')->sort()->values();

        return Inertia::render('laporan/nilai', [
            'nilai' => $nilai,
            'kelasList' => $kelasList,
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => $request->only(['kelas', 'tahun_ajaran']),
        ]);
    }

    /**
     * Laporan prediksi jurusan
     */
    public function prediksi(Request $request)
    {
        $query = PrediksiJurusan::with('siswaLengkap');

        // Filter berdasarkan jurusan prediksi
        if ($request->jurusan && $request->jurusan !== 'semua') {
            $query->where('jurusan_prediksi', $request->jurusan);
        }

        // Filter berdasarkan tingkat confidence
        if ($request->confidence_min) {
            $query->where('confidence_score', '>=', $request->confidence_min / 100);
        }

        // Filter berdasarkan kelas
        if ($request->kelas && $request->kelas !== 'semua') {
            $query->whereHas('siswaLengkap', function($q) use ($request) {
                $q->where('kelas', $request->kelas);
            });
        }

        $prediksi = $query->orderBy('confidence_score', 'desc')->paginate(20);

        $jurusanList = PrediksiJurusan::distinct('jurusan_prediksi')->pluck('jurusan_prediksi')->sort()->values();
        $kelasList = SiswaLengkap::distinct('kelas')->pluck('kelas')->sort()->values();

        // Statistik confidence
        $statistikAkurasi = [
            'rata_rata' => PrediksiJurusan::avg('confidence_score') * 100,
            'tertinggi' => PrediksiJurusan::max('confidence_score') * 100,
            'terendah' => PrediksiJurusan::min('confidence_score') * 100,
            'total' => PrediksiJurusan::count(),
        ];

        return Inertia::render('laporan/prediksi', [
            'prediksi' => $prediksi,
            'jurusanList' => $jurusanList,
            'kelasList' => $kelasList,
            'statistikAkurasi' => $statistikAkurasi,
            'filters' => $request->only(['jurusan', 'confidence_min', 'kelas']),
        ]);
    }

    /**
     * Export laporan ke PDF/Excel (placeholder untuk implementasi selanjutnya)
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'siswa');
        $format = $request->get('format', 'pdf');

        // Placeholder untuk export functionality
        return response()->json([
            'message' => "Export laporan {$type} dalam format {$format} akan diimplementasikan",
            'type' => $type,
            'format' => $format
        ]);
    }
}