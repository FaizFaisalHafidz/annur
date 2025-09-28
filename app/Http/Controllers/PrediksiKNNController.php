<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SiswaLengkap;
use App\Models\PrediksiJurusan;
use App\Models\NilaiAkademik;
use App\Models\SurveiMinatBakat;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PrediksiKNNController extends Controller
{
    public function index()
    {
        $stats = [
            'total_siswa' => SiswaLengkap::count(),
            'sudah_prediksi' => PrediksiJurusan::count(),
            'belum_prediksi' => SiswaLengkap::count() - PrediksiJurusan::count(),
            'akurasi_model' => 85.5, // Nanti bisa diambil dari file model
        ];

        // Ambil prediksi terbaru
        $prediksi_terbaru = PrediksiJurusan::with(['siswaLengkap'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Distribusi jurusan yang diprediksi
        $distribusi_jurusan = PrediksiJurusan::select('jurusan_prediksi', DB::raw('count(*) as total'))
            ->groupBy('jurusan_prediksi')
            ->orderBy('total', 'desc')
            ->get();

        return Inertia::render('prediksi/index', [
            'stats' => $stats,
            'prediksi_terbaru' => $prediksi_terbaru,
            'distribusi_jurusan' => $distribusi_jurusan,
        ]);
    }

    public function create()
    {
        // Ambil siswa yang belum ada prediksi
        $siswa_belum_prediksi = SiswaLengkap::whereNotIn('id', function($query) {
            $query->select('siswa_lengkap_id')->from('prediksi_jurusan');
        })
        ->with(['nilaiAkademik', 'surveiMinatBakat'])
        ->orderBy('nama_lengkap')
        ->get();

        // Ambil daftar kelas untuk filter
        $daftar_kelas = SiswaLengkap::distinct('kelas')
            ->orderBy('kelas')
            ->pluck('kelas');

        return Inertia::render('prediksi/create', [
            'siswa_belum_prediksi' => $siswa_belum_prediksi,
            'daftar_kelas' => $daftar_kelas,
        ]);
    }

    public function predictSingle(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswa_lengkap,id'
        ]);

        try {
            $siswa = SiswaLengkap::with(['nilaiAkademik', 'surveiMinatBakat'])
                ->findOrFail($request->siswa_id);

            // Cek apakah siswa sudah punya prediksi
            $existing_prediction = PrediksiJurusan::where('siswa_lengkap_id', $siswa->id)->first();
            if ($existing_prediction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Siswa ini sudah memiliki prediksi jurusan'
                ]);
            }

            // Persiapkan data untuk prediksi
            $prediction_data = $this->preparePredictionData($siswa);

            if (!$prediction_data['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $prediction_data['message']
                ]);
            }

            // Jalankan prediksi Python
            $result = $this->runPythonPrediction($prediction_data['data']);

            if ($result['success']) {
                // Persiapkan data nilai mata pelajaran
                $nilai_akademik = $siswa->nilaiAkademik->first();
                $nilai_mata_pelajaran = [
                    'matematika' => $nilai_akademik->matematika ?? 75,
                    'bahasa_indonesia' => $nilai_akademik->bahasa_indonesia ?? 75,
                    'bahasa_inggris' => $nilai_akademik->bahasa_inggris ?? 75,
                    'fisika' => $nilai_akademik->fisika ?? 75,
                    'kimia' => $nilai_akademik->kimia ?? 75,
                    'biologi' => $nilai_akademik->biologi ?? 75,
                    'sejarah' => $nilai_akademik->sejarah ?? 75,
                    'geografi' => $nilai_akademik->geografi ?? 75,
                    'ekonomi' => $nilai_akademik->ekonomi ?? 75,
                    'sosiologi' => $nilai_akademik->sosiologi ?? 75,
                    'pkn' => $nilai_akademik->pkn ?? 75,
                    'seni_budaya' => $nilai_akademik->seni_budaya ?? 75,
                    'prakarya' => $nilai_akademik->prakarya ?? 75,
                    'pjok' => $nilai_akademik->pjok ?? 75,
                ];
                
                // Mata pelajaran yang dikuasai (nilai >= 80)
                $mata_pelajaran_dikuasai = [];
                foreach ($nilai_mata_pelajaran as $mapel => $nilai) {
                    if ($nilai >= 80) {
                        $mata_pelajaran_dikuasai[] = $mapel;
                    }
                }
                
                // Tentukan kategori jurusan prediksi
                $kategori_jurusan_prediksi = 'Umum';
                if (isset($result['data']['academic_analysis'])) {
                    $kategori_jurusan_prediksi = $result['data']['academic_analysis']['academic_strength'] ?? 'Umum';
                }
                
                // Simpan hasil prediksi
                $prediksi = PrediksiJurusan::create([
                    'siswa_lengkap_id' => $siswa->id,
                    'nilai_mata_pelajaran' => $nilai_mata_pelajaran,
                    'mata_pelajaran_dikuasai' => $mata_pelajaran_dikuasai,
                    'minat_ipa' => $siswa->surveiMinatBakat->minat_ipa ?? 3.0,
                    'minat_ips' => $siswa->surveiMinatBakat->minat_ips ?? 3.0,
                    'minat_bahasa' => $siswa->surveiMinatBakat->minat_bahasa ?? 3.0,
                    'minat_seni' => $siswa->surveiMinatBakat->minat_seni ?? 3.0,
                    'minat_olahraga' => $siswa->surveiMinatBakat->minat_olahraga ?? 3.0,
                    'jurusan_prediksi' => $result['data']['predicted_major'],
                    'kategori_jurusan_prediksi' => $kategori_jurusan_prediksi,
                    'confidence_score' => $result['data']['confidence'] / 100, // Convert percentage to decimal
                    'alternatif_jurusan' => $result['data']['recommendations'] ?? [],
                    'model_version' => '2.0',
                    'parameter_input' => json_encode([
                        'k_neighbors' => 5,
                        'algorithm' => 'KNN',
                        'features_used' => 21,
                        'input_data' => $prediction_data['data'],
                        'academic_analysis' => $result['data']['academic_analysis'] ?? []
                    ]),
                    'tanggal_prediksi' => now(),
                ]);

                return redirect()->route('prediksi-knn.show', $prediksi->id)
                    ->with('success', 'Prediksi berhasil dilakukan untuk siswa ' . $siswa->nama_lengkap);
            } else {
                return redirect()->back()
                    ->withErrors(['error' => $result['error']])
                    ->withInput();
            }

        } catch (\Exception $e) {
            Log::error('Error in predictSingle: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function predictBulk(Request $request)
    {
        $request->validate([
            'siswa_ids' => 'required|array|min:1',
            'siswa_ids.*' => 'exists:siswa_lengkap,id'
        ]);

        try {
            $siswa_list = SiswaLengkap::with(['nilaiAkademik', 'surveiMinatBakat'])
                ->whereIn('id', $request->siswa_ids)
                ->get();

            $results = [
                'success' => 0,
                'failed' => 0,
                'details' => []
            ];

            foreach ($siswa_list as $siswa) {
                // Cek apakah siswa sudah punya prediksi
                $existing_prediction = PrediksiJurusan::where('siswa_lengkap_id', $siswa->id)->first();
                if ($existing_prediction) {
                    $results['failed']++;
                    $results['details'][] = [
                        'siswa' => $siswa->nama_lengkap,
                        'status' => 'failed',
                        'message' => 'Sudah memiliki prediksi'
                    ];
                    continue;
                }

                // Persiapkan data untuk prediksi
                $prediction_data = $this->preparePredictionData($siswa);

                if (!$prediction_data['success']) {
                    $results['failed']++;
                    $results['details'][] = [
                        'siswa' => $siswa->nama_lengkap,
                        'status' => 'failed',
                        'message' => $prediction_data['message']
                    ];
                    continue;
                }

                // Jalankan prediksi Python
                $result = $this->runPythonPrediction($prediction_data['data']);

                if ($result['success']) {
                    // Persiapkan data nilai mata pelajaran
                    $nilai_akademik = $siswa->nilaiAkademik->first();
                    $nilai_mata_pelajaran = [
                        'matematika' => $nilai_akademik->matematika ?? 75,
                        'bahasa_indonesia' => $nilai_akademik->bahasa_indonesia ?? 75,
                        'bahasa_inggris' => $nilai_akademik->bahasa_inggris ?? 75,
                        'fisika' => $nilai_akademik->fisika ?? 75,
                        'kimia' => $nilai_akademik->kimia ?? 75,
                        'biologi' => $nilai_akademik->biologi ?? 75,
                        'sejarah' => $nilai_akademik->sejarah ?? 75,
                        'geografi' => $nilai_akademik->geografi ?? 75,
                        'ekonomi' => $nilai_akademik->ekonomi ?? 75,
                        'sosiologi' => $nilai_akademik->sosiologi ?? 75,
                        'pkn' => $nilai_akademik->pkn ?? 75,
                        'seni_budaya' => $nilai_akademik->seni_budaya ?? 75,
                        'prakarya' => $nilai_akademik->prakarya ?? 75,
                        'pjok' => $nilai_akademik->pjok ?? 75,
                    ];
                    
                    // Mata pelajaran yang dikuasai (nilai >= 80)
                    $mata_pelajaran_dikuasai = [];
                    foreach ($nilai_mata_pelajaran as $mapel => $nilai) {
                        if ($nilai >= 80) {
                            $mata_pelajaran_dikuasai[] = $mapel;
                        }
                    }
                    
                    // Tentukan kategori jurusan prediksi
                    $kategori_jurusan_prediksi = 'Umum';
                    if (isset($result['data']['academic_analysis'])) {
                        $kategori_jurusan_prediksi = $result['data']['academic_analysis']['academic_strength'] ?? 'Umum';
                    }
                    
                    // Simpan hasil prediksi
                    PrediksiJurusan::create([
                        'siswa_lengkap_id' => $siswa->id,
                        'nilai_mata_pelajaran' => $nilai_mata_pelajaran,
                        'mata_pelajaran_dikuasai' => $mata_pelajaran_dikuasai,
                        'minat_ipa' => $siswa->surveiMinatBakat->minat_ipa ?? 3.0,
                        'minat_ips' => $siswa->surveiMinatBakat->minat_ips ?? 3.0,
                        'minat_bahasa' => $siswa->surveiMinatBakat->minat_bahasa ?? 3.0,
                        'minat_seni' => $siswa->surveiMinatBakat->minat_seni ?? 3.0,
                        'minat_olahraga' => $siswa->surveiMinatBakat->minat_olahraga ?? 3.0,
                        'jurusan_prediksi' => $result['data']['predicted_major'],
                        'kategori_jurusan_prediksi' => $kategori_jurusan_prediksi,
                        'confidence_score' => $result['data']['confidence'] / 100, // Convert percentage to decimal
                        'alternatif_jurusan' => $result['data']['recommendations'] ?? [],
                        'model_version' => '2.0',
                        'parameter_input' => json_encode([
                            'k_neighbors' => 5,
                            'algorithm' => 'KNN',
                            'features_used' => 21,
                            'input_data' => $prediction_data['data'],
                            'academic_analysis' => $result['data']['academic_analysis'] ?? []
                        ]),
                        'tanggal_prediksi' => now(),
                    ]);

                    $results['success']++;
                    $results['details'][] = [
                        'siswa' => $siswa->nama_lengkap,
                        'status' => 'success',
                        'prediksi' => $result['data']['predicted_major'],
                        'confidence' => $result['data']['confidence']
                    ];
                } else {
                    $results['failed']++;
                    $results['details'][] = [
                        'siswa' => $siswa->nama_lengkap,
                        'status' => 'failed',
                        'message' => $result['error']
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Prediksi selesai: {$results['success']} berhasil, {$results['failed']} gagal",
                'data' => $results
            ]);

        } catch (\Exception $e) {
            Log::error('Error in predictBulk: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ]);
        }
    }

    public function predictByClass(Request $request)
    {
        $request->validate([
            'kelas' => 'required|string'
        ]);

        try {
            // Ambil semua siswa di kelas tersebut yang belum ada prediksi
            $siswa_ids = SiswaLengkap::where('kelas', $request->kelas)
                ->whereNotIn('id', function($query) {
                    $query->select('siswa_lengkap_id')->from('prediksi_jurusan');
                })
                ->pluck('id')
                ->toArray();

            if (empty($siswa_ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada siswa di kelas ' . $request->kelas . ' yang perlu diprediksi'
                ]);
            }

            // Jalankan prediksi bulk
            $bulk_request = new Request(['siswa_ids' => $siswa_ids]);
            return $this->predictBulk($bulk_request);

        } catch (\Exception $e) {
            Log::error('Error in predictByClass: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ]);
        }
    }

    private function preparePredictionData($siswa)
    {
        // Cek apakah siswa memiliki data nilai dan survei
        if (!$siswa->nilaiAkademik || $siswa->nilaiAkademik->isEmpty()) {
            return [
                'success' => false,
                'message' => 'Siswa belum memiliki data nilai akademik'
            ];
        }

        if (!$siswa->surveiMinatBakat) {
            return [
                'success' => false,
                'message' => 'Siswa belum mengisi survei minat bakat'
            ];
        }

        $nilai = $siswa->nilaiAkademik->first();
        $survei = $siswa->surveiMinatBakat;

        // Ambil mata pelajaran yang dikuasai (nilai >= 75)
        $mata_pelajaran_dikuasai = [];
        $subjects_map = [
            'matematika' => $nilai->matematika ?? 0,
            'fisika' => $nilai->fisika ?? 0,
            'kimia' => $nilai->kimia ?? 0,
            'biologi' => $nilai->biologi ?? 0,
            'b_indonesia' => $nilai->b_indonesia ?? 0,
            'b_inggris' => $nilai->b_inggris ?? 0,
            'sejarah' => $nilai->sejarah ?? 0,
            'geografi' => $nilai->geografi ?? 0,
            'informatika' => $nilai->informatika ?? 0,
            'seni_budaya' => $nilai->seni_budaya ?? 0,
        ];

        foreach ($subjects_map as $subject => $score) {
            if ($score >= 75) {
                $mata_pelajaran_dikuasai[] = $subject;
            }
        }

        return [
            'success' => true,
            'data' => [
                // Data siswa
                'jenis_kelamin' => $siswa->jenis_kelamin,
                
                // Data nilai akademik
                'matematika' => $nilai->matematika ?? 75,
                'bahasa_indonesia' => $nilai->bahasa_indonesia ?? 75,
                'bahasa_inggris' => $nilai->bahasa_inggris ?? 75,
                'fisika' => $nilai->fisika ?? 75,
                'kimia' => $nilai->kimia ?? 75,
                'biologi' => $nilai->biologi ?? 75,
                'sejarah' => $nilai->sejarah ?? 75,
                'geografi' => $nilai->geografi ?? 75,
                'ekonomi' => $nilai->ekonomi ?? 75,
                'sosiologi' => $nilai->sosiologi ?? 75,
                'pkn' => $nilai->pkn ?? 75,
                'seni_budaya' => $nilai->seni_budaya ?? 75,
                'prakarya' => $nilai->prakarya ?? 75,
                'pjok' => $nilai->pjok ?? 75,
                'peminatan_1' => $nilai->peminatan_1 ?? 75,
                'peminatan_2' => $nilai->peminatan_2 ?? 75,
                'rata_rata_keseluruhan' => $nilai->rata_rata_keseluruhan ?? 75,
                
                // Data survei minat bakat
                'rencana_kuliah' => $survei->rencana_kuliah ?? 'Iya',
                'jurusan_diminati' => $survei->jurusan_diminati ?? 'Belum ditentukan',
                'kategori_jurusan' => $survei->kategori_jurusan ?? 'Saintek',
                'kategori_jurusan_encoded' => $survei->kategori_jurusan === 'Saintek' ? 1 : 0,
                'tingkat_keyakinan' => $survei->tingkat_keyakinan ?? 75,
                
                // Additional computed data  
                'mata_pelajaran_dikuasai' => $mata_pelajaran_dikuasai,
            ]
        ];
    }

    private function runPythonPrediction($data)
    {
        try {
            $python_path = base_path('python');
            $script_path = $python_path . '/predict_silent.py';
            
            Log::info('Python prediction started', [
                'python_path' => $python_path,
                'script_path' => $script_path,
                'environment' => app()->environment(),
                'input_data_keys' => array_keys($data)
            ]);
            
            // Pastikan script Python ada
            if (!file_exists($script_path)) {
                Log::error('Python script not found', ['script_path' => $script_path]);
                return [
                    'success' => false,
                    'error' => 'Script prediksi Python tidak ditemukan'
                ];
            }

            // Check virtual environment
            $venv_activate_path = $python_path . '/.venv/bin/activate';
            $venv_exists = file_exists($venv_activate_path);
            
            Log::info('Virtual environment check', [
                'venv_path' => $venv_activate_path,
                'venv_exists' => $venv_exists,
                'is_production' => app()->environment('production')
            ]);

            // Encode data sebagai JSON
            $json_data = json_encode($data, JSON_UNESCAPED_UNICODE);
            Log::info('JSON data prepared', ['json_length' => strlen($json_data)]);
            
            // Jalankan script Python dengan virtual environment
            if (app()->environment('production')) {
                // Production environment - use virtual environment
                $command = "cd " . escapeshellarg($python_path) . " && source .venv/bin/activate && python predict_silent.py " . escapeshellarg($json_data);
            } else {
                // Local environment - use virtual environment if exists, fallback to system python
                if ($venv_exists) {
                    $command = "cd " . escapeshellarg($python_path) . " && source .venv/bin/activate && python predict_silent.py " . escapeshellarg($json_data);
                } else {
                    $command = "cd " . escapeshellarg($python_path) . " && python3 predict_silent.py " . escapeshellarg($json_data);
                }
            }
            
            Log::info('Executing Python command', ['command' => $command]);
            
            // Test if Python script can be executed manually
            $test_command = "cd " . escapeshellarg($python_path) . " && ls -la predict_silent.py 2>&1";
            $test_output = shell_exec($test_command);
            Log::info('Python script file check', ['test_output' => $test_output]);
            
            // Test virtual environment activation
            $venv_test_command = "cd " . escapeshellarg($python_path) . " && source .venv/bin/activate && which python 2>&1";
            $venv_test_output = shell_exec($venv_test_command);
            Log::info('Virtual environment test', ['venv_test_output' => $venv_test_output]);
            
            // Test Python script without arguments first
            $simple_test_command = "cd " . escapeshellarg($python_path) . " && source .venv/bin/activate && python predict_silent.py 2>&1";
            $simple_test_output = shell_exec($simple_test_command);
            Log::info('Python script simple test', ['simple_test_output' => $simple_test_output]);
            
            $start_time = microtime(true);
            $output = shell_exec($command . " 2>&1");
            $execution_time = microtime(true) - $start_time;
            
            Log::info('Python execution completed', [
                'execution_time' => $execution_time,
                'output_length' => $output ? strlen($output) : 0,
                'output_preview' => $output ? substr($output, 0, 200) : 'null'
            ]);
            
            if ($output === null) {
                Log::error('Python command returned null output');
                return [
                    'success' => false,
                    'error' => 'Gagal menjalankan script Python - tidak ada output'
                ];
            }

            // Log raw output for debugging
            Log::info('Python raw output', ['output' => $output]);

            // Parse output JSON
            $trimmed_output = trim($output);
            $result = json_decode($trimmed_output, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('JSON decode failed', [
                    'json_error' => json_last_error_msg(),
                    'raw_output' => $output,
                    'trimmed_output' => $trimmed_output
                ]);
                return [
                    'success' => false,
                    'error' => 'Output Python tidak valid JSON: ' . json_last_error_msg() . ' | Output: ' . $output
                ];
            }

            Log::info('Python prediction successful', [
                'result_success' => $result['success'] ?? 'unknown',
                'result_keys' => array_keys($result)
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('Exception in runPythonPrediction', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return [
                'success' => false,
                'error' => 'Kesalahan menjalankan prediksi: ' . $e->getMessage()
            ];
        }
    }

    public function show($id)
    {
        $prediksi = PrediksiJurusan::with(['siswaLengkap.nilaiAkademik', 'siswaLengkap.surveiMinatBakat'])
            ->findOrFail($id);

        // Parse parameter input untuk mendapatkan detail analysis
        $parameter_input = json_decode($prediksi->parameter_input, true);
        
        return Inertia::render('prediksi/show', [
            'prediksi' => $prediksi,
            'analysis_detail' => $parameter_input['academic_analysis'] ?? null,
            'input_data' => $parameter_input['input_data'] ?? null,
        ]);
    }

    public function destroy($id)
    {
        try {
            $prediksi = PrediksiJurusan::findOrFail($id);
            $prediksi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Prediksi berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus prediksi: ' . $e->getMessage()
            ]);
        }
    }
}
