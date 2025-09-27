<?php

use App\Http\Controllers\SiswaLengkapController;
use App\Http\Controllers\PrediksiKNNController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PengaturanController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Routes untuk menu utama sistem
    Route::resource('siswa', SiswaLengkapController::class);
    Route::get('/siswa/{siswa}/nilai', [SiswaLengkapController::class, 'showNilai'])->name('siswa.nilai');
    Route::post('/siswa/{siswa}/nilai', [SiswaLengkapController::class, 'storeNilai'])->name('siswa.nilai.store');
    Route::get('/siswa/{siswa}/survei', [SiswaLengkapController::class, 'showSurvei'])->name('siswa.survei');
    Route::post('/siswa/{siswa}/survei', [SiswaLengkapController::class, 'storeSurvei'])->name('siswa.survei.store');
    
    // Routes prediksi KNN
    Route::resource('prediksi', PrediksiKNNController::class);
    Route::get('/prediksi-knn', [PrediksiKNNController::class, 'create'])->name('prediksi.create');
    Route::get('/prediksi-knn/{prediksi}', [PrediksiKNNController::class, 'show'])->name('prediksi-knn.show');
    Route::post('/prediksi/single', [PrediksiKNNController::class, 'predictSingle'])->name('prediksi.single');
    Route::post('/prediksi/bulk', [PrediksiKNNController::class, 'predictBulk'])->name('prediksi.bulk');
    Route::post('/prediksi/class', [PrediksiKNNController::class, 'predictByClass'])->name('prediksi.class');
    
    // Routes laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/siswa', [LaporanController::class, 'siswa'])->name('laporan.siswa');
    Route::get('/laporan/nilai', [LaporanController::class, 'nilai'])->name('laporan.nilai');
    Route::get('/laporan/prediksi', [LaporanController::class, 'prediksi'])->name('laporan.prediksi');
    Route::get('/laporan/export', [LaporanController::class, 'export'])->name('laporan.export');
    
    // Routes pengaturan
    Route::get('/pengaturan', [PengaturanController::class, 'index'])->name('pengaturan.index');
    Route::patch('/pengaturan/profile', [PengaturanController::class, 'updateProfile'])->name('pengaturan.profile.update');
    Route::patch('/pengaturan/password', [PengaturanController::class, 'updatePassword'])->name('pengaturan.password.update');
    Route::post('/pengaturan/optimize', [PengaturanController::class, 'optimizeSystem'])->name('pengaturan.optimize');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
