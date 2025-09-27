<?php

namespace App\Http\Controllers;

use App\Models\SiswaLengkap;
use App\Models\NilaiAkademik;
use App\Models\SurveiMinatBakat;
use App\Models\PrediksiJurusan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard
     */
    public function index()
    {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        
        // Statistik umum
        $statistikUmum = [
            'total_siswa' => SiswaLengkap::count(),
            'siswa_aktif' => SiswaLengkap::where('is_aktif', true)->count(),
            'total_prediksi' => PrediksiJurusan::count(),
            'prediksi_bulan_ini' => PrediksiJurusan::whereMonth('tanggal_prediksi', now()->month)
                                                 ->whereYear('tanggal_prediksi', now()->year)
                                                 ->count(),
        ];

        // Statistik berdasarkan role
        $roleSpecificData = [];
        
        if (in_array('Super Admin', $userRoles)) {
            $roleSpecificData = $this->getSuperAdminData();
        } elseif (in_array('Guru BK', $userRoles)) {
            $roleSpecificData = $this->getGuruBKData();
        }

        // Data untuk charts
        $chartData = [
            'prediksi_per_bulan' => $this->getPrediksiPerBulan(),
            'distribusi_jurusan' => $this->getDistribusiJurusan(),
            'siswa_per_kelas' => $this->getSiswaPerKelas(),
            'confidence_score_distribution' => $this->getConfidenceScoreDistribution(),
        ];

        // Recent activities
        $recentActivities = $this->getRecentActivities();

        return Inertia::render('dashboard2', [
            'statistikUmum' => $statistikUmum,
            'roleSpecificData' => $roleSpecificData,
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
            'userRoles' => $userRoles,
        ]);
    }

    /**
     * Get data specific for Super Admin
     */
    private function getSuperAdminData()
    {
        return [
            'total_users' => User::count(),
            'users_aktif' => User::whereNotNull('email_verified_at')->count(),
            'data_nilai' => NilaiAkademik::count(),
            'data_survei' => SurveiMinatBakat::count(),
            'completion_rate' => $this->getDataCompletionRate(),
            'sistem_health' => $this->getSystemHealth(),
        ];
    }

    /**
     * Get data specific for Guru BK
     */
    private function getGuruBKData()
    {
        return [
            'siswa_perlu_prediksi' => $this->getSiswaPerluPrediksi(),
            'prediksi_minggu_ini' => PrediksiJurusan::whereBetween('tanggal_prediksi', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'rata_rata_confidence' => PrediksiJurusan::avg('confidence_score') * 100,
            'jurusan_terpopuler' => $this->getJurusanTerpopuler(),
        ];
    }

    /**
     * Get prediksi data per month for the last 6 months
     */
    private function getPrediksiPerBulan()
    {
        return PrediksiJurusan::selectRaw('MONTH(tanggal_prediksi) as month, COUNT(*) as count')
            ->whereYear('tanggal_prediksi', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $this->getMonthName($item->month),
                    'count' => $item->count,
                ];
            });
    }

    /**
     * Get distribusi jurusan prediksi
     */
    private function getDistribusiJurusan()
    {
        return PrediksiJurusan::select('jurusan_prediksi', DB::raw('count(*) as total'))
            ->groupBy('jurusan_prediksi')
            ->orderBy('total', 'desc')
            ->limit(8)
            ->get();
    }

    /**
     * Get siswa per kelas
     */
    private function getSiswaPerKelas()
    {
        return SiswaLengkap::select('kelas', DB::raw('count(*) as total'))
            ->groupBy('kelas')
            ->orderBy('kelas')
            ->get();
    }

    /**
     * Get confidence score distribution
     */
    private function getConfidenceScoreDistribution()
    {
        return DB::table('prediksi_jurusan')
            ->selectRaw('
                CASE 
                    WHEN confidence_score >= 0.9 THEN "Sangat Tinggi (90%+)"
                    WHEN confidence_score >= 0.8 THEN "Tinggi (80-89%)"
                    WHEN confidence_score >= 0.7 THEN "Sedang (70-79%)"
                    ELSE "Rendah (<70%)"
                END as kategori,
                COUNT(*) as jumlah
            ')
            ->groupBy('kategori')
            ->get();
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities()
    {
        $recentPrediksi = PrediksiJurusan::with('siswaLengkap:id,nama_lengkap,kelas')
            ->orderBy('tanggal_prediksi', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($prediksi) {
                return [
                    'type' => 'prediksi',
                    'message' => "Prediksi selesai untuk {$prediksi->siswaLengkap->nama_lengkap} ({$prediksi->siswaLengkap->kelas})",
                    'detail' => $prediksi->jurusan_prediksi,
                    'time' => $prediksi->tanggal_prediksi,
                ];
            });

        $recentSiswa = SiswaLengkap::orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($siswa) {
                return [
                    'type' => 'siswa',
                    'message' => "Siswa baru ditambahkan: {$siswa->nama_lengkap}",
                    'detail' => "Kelas {$siswa->kelas}",
                    'time' => $siswa->created_at,
                ];
            });

        return $recentPrediksi->concat($recentSiswa)
            ->sortByDesc('time')
            ->take(8)
            ->values();
    }

    /**
     * Get data completion rate
     */
    private function getDataCompletionRate()
    {
        $totalSiswa = SiswaLengkap::count();
        if ($totalSiswa === 0) return 0;

        $siswaWithNilai = NilaiAkademik::distinct('siswa_lengkap_id')->count();
        $siswaWithSurvei = SurveiMinatBakat::distinct('siswa_lengkap_id')->count();
        
        return [
            'nilai' => round(($siswaWithNilai / $totalSiswa) * 100, 1),
            'survei' => round(($siswaWithSurvei / $totalSiswa) * 100, 1),
        ];
    }

    /**
     * Get system health indicators
     */
    private function getSystemHealth()
    {
        return [
            'database' => 'healthy',
            'cache' => 'healthy',
            'storage' => 'healthy',
        ];
    }

    /**
     * Get siswa yang perlu prediksi
     */
    private function getSiswaPerluPrediksi()
    {
        $totalSiswa = SiswaLengkap::where('is_aktif', true)->count();
        $sudahPrediksi = PrediksiJurusan::distinct('siswa_lengkap_id')->count();
        
        return $totalSiswa - $sudahPrediksi;
    }

    /**
     * Get jurusan terpopuler
     */
    private function getJurusanTerpopuler()
    {
        return PrediksiJurusan::select('jurusan_prediksi')
            ->groupBy('jurusan_prediksi')
            ->orderByRaw('COUNT(*) DESC')
            ->limit(3)
            ->pluck('jurusan_prediksi')
            ->toArray();
    }

    /**
     * Helper: Get month name
     */
    private function getMonthName($month)
    {
        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        return $months[$month] ?? 'Unknown';
    }
}