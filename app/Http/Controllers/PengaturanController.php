<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    /**
     * Display pengaturan page
     */
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('pengaturan/index', [
            'user' => $user,
            'systemInfo' => [
                'app_name' => config('app.name', 'Sistem Prediksi Jurusan'),
                'app_version' => '1.0.0',
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION,
                'environment' => config('app.env'),
            ],
        ]);
    }

    /**
     * Update profile information
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password berhasil diperbarui');
    }

    /**
     * Clear cache and optimize system
     */
    public function optimizeSystem()
    {
        try {
            // Clear various caches
            \Artisan::call('cache:clear');
            \Artisan::call('config:clear');
            \Artisan::call('route:clear');
            \Artisan::call('view:clear');

            return redirect()->back()->with('success', 'Sistem berhasil dioptimasi');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengoptimasi sistem: ' . $e->getMessage());
        }
    }
}