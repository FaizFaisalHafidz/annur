import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Database, Lock, Settings, Shield, User, Zap } from 'lucide-react';
import { useState } from 'react';

interface PengaturanProps {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
    };
    systemInfo: {
        app_name: string;
        app_version: string;
        laravel_version: string;
        php_version: string;
        environment: string;
    };
}

export default function PengaturanIndex({ user, systemInfo }: PengaturanProps) {
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch('/pengaturan/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.patch('/pengaturan/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleOptimizeSystem = () => {
        if (confirm('Apakah Anda yakin ingin mengoptimasi sistem? Proses ini akan membersihkan cache.')) {
            useForm().post('/pengaturan/optimize');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title="Pengaturan" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Pengaturan</h1>
                    <p className="text-muted-foreground">
                        Kelola profil, keamanan, dan konfigurasi sistem
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile" className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Keamanan</span>
                        </TabsTrigger>
                        <TabsTrigger value="system" className="flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Sistem</span>
                        </TabsTrigger>
                        <TabsTrigger value="about" className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Tentang</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="w-5 h-5" />
                                    <span>Informasi Profil</span>
                                </CardTitle>
                                <CardDescription>
                                    Update informasi profil dan alamat email Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                                className={profileForm.errors.name ? 'border-red-500' : ''}
                                                required
                                            />
                                            {profileForm.errors.name && (
                                                <p className="text-sm text-red-500">{profileForm.errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                                className={profileForm.errors.email ? 'border-red-500' : ''}
                                                required
                                            />
                                            {profileForm.errors.email && (
                                                <p className="text-sm text-red-500">{profileForm.errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Status Verifikasi Email</Label>
                                        <div className="flex items-center space-x-2">
                                            {user.email_verified_at ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                    ✓ Terverifikasi pada {formatDate(user.email_verified_at)}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                    ⚠ Belum terverifikasi
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button 
                                            type="submit" 
                                            disabled={profileForm.processing}
                                        >
                                            {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Akun</CardTitle>
                                <CardDescription>
                                    Detail informasi akun Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">User ID</Label>
                                        <p className="font-mono text-sm">{user.id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Bergabung Sejak</Label>
                                        <p className="text-sm">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lock className="w-5 h-5" />
                                    <span>Ubah Password</span>
                                </CardTitle>
                                <CardDescription>
                                    Pastikan akun Anda menggunakan password yang kuat
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Password Saat Ini</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            className={passwordForm.errors.current_password ? 'border-red-500' : ''}
                                            required
                                        />
                                        {passwordForm.errors.current_password && (
                                            <p className="text-sm text-red-500">{passwordForm.errors.current_password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password Baru</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            className={passwordForm.errors.password ? 'border-red-500' : ''}
                                            required
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="text-sm text-red-500">{passwordForm.errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button 
                                            type="submit" 
                                            disabled={passwordForm.processing}
                                        >
                                            {passwordForm.processing ? 'Mengupdate...' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* System Tab */}
                    <TabsContent value="system" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Database className="w-5 h-5" />
                                    <span>Optimasi Sistem</span>
                                </CardTitle>
                                <CardDescription>
                                    Bersihkan cache dan optimasi performa sistem
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-900">Optimasi Cache</h4>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Bersihkan cache aplikasi, konfigurasi, route, dan view untuk meningkatkan performa sistem.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleOptimizeSystem} className="w-full">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Optimasi Sistem Sekarang
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* About Tab */}
                    <TabsContent value="about" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>Informasi Sistem</span>
                                </CardTitle>
                                <CardDescription>
                                    Detail versi dan konfigurasi sistem
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Nama Aplikasi</Label>
                                        <p className="font-medium">{systemInfo.app_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Versi Aplikasi</Label>
                                        <p className="font-medium">{systemInfo.app_version}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Laravel Version</Label>
                                        <p className="font-mono text-sm">{systemInfo.laravel_version}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">PHP Version</Label>
                                        <p className="font-mono text-sm">{systemInfo.php_version}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Environment</Label>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            systemInfo.environment === 'production' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {systemInfo.environment.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-center text-sm text-muted-foreground">
                                    <p>&copy; 2025 Sistem Prediksi Jurusan K-NN</p>
                                    <p>Developed with ❤️ using Laravel & React</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}