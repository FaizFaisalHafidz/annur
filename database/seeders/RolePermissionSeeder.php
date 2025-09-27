<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'kelola-siswa',
            'kelola-mata-pelajaran',
            'kelola-jurusan',
            'prediksi-knn',
            'lihat-laporan',
            'kelola-pengguna',
            'kelola-pengaturan'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $guru = Role::create(['name' => 'Guru BK']);

        // Assign permissions to roles
        $superAdmin->givePermissionTo(Permission::all());
        $guru->givePermissionTo(['prediksi-knn', 'lihat-laporan', 'kelola-siswa']);

        // Create default users
        $adminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@matemannur.sch.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $guruUser = User::create([
            'name' => 'Guru BK',
            'email' => 'gurubk@matemannur.sch.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Assign roles to users
        $adminUser->assignRole('Super Admin');
        $guruUser->assignRole('Guru BK');
    }
}
