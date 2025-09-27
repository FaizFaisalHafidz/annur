import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    BarChart3,
    Brain,
    Clock,
    FileText,
    GraduationCap,
    PieChart,
    Settings,
    Shield,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';

interface DashboardProps {
    statistikUmum: {
        total_siswa: number;
        siswa_aktif: number;
        total_prediksi: number;
        prediksi_bulan_ini: number;
    };
    roleSpecificData: any;
    chartData: {
        prediksi_per_bulan: Array<{
            month: string;
            count: number;
        }>;
        distribusi_jurusan: Array<{
            jurusan_prediksi: string;
            total: number;
        }>;
        siswa_per_kelas: Array<{
            kelas: string;
            total: number;
        }>;
        confidence_score_distribution: Array<{
            kategori: string;
            jumlah: number;
        }>;
    };
    recentActivities: Array<{
        type: string;
        message: string;
        detail: string;
        time: string;
    }>;
    userRoles: string[];
}

export default function Dashboard({
    statistikUmum,
    roleSpecificData,
    chartData,
    recentActivities,
    userRoles
}: DashboardProps) {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatDecimal = (num: number) => {
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
        }).format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isSuperAdmin = userRoles.includes('Super Admin');
    const isGuruBK = userRoles.includes('Guru BK');

    return (
        <AppLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Selamat datang di Sistem Prediksi Jurusan K-NN
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {userRoles.map(role => (
                            <span 
                                key={role}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistikUmum.total_siswa)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(statistikUmum.siswa_aktif)} siswa aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Prediksi</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistikUmum.total_prediksi)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(statistikUmum.prediksi_bulan_ini)} bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {isSuperAdmin && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatNumber(roleSpecificData.total_users)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatNumber(roleSpecificData.users_aktif)} terverifikasi
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Kelengkapan Data</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatDecimal((roleSpecificData.completion_rate.nilai + roleSpecificData.completion_rate.survei) / 2)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Nilai: {roleSpecificData.completion_rate.nilai}% | Survei: {roleSpecificData.completion_rate.survei}%
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {isGuruBK && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Perlu Prediksi</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {formatNumber(roleSpecificData.siswa_perlu_prediksi)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Siswa belum diprediksi
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Rata-rata Confidence</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatDecimal(roleSpecificData.rata_rata_confidence)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Akurasi prediksi KNN
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Link href="/siswa">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                <CardTitle className="text-base">Kelola Siswa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Tambah, edit, dan kelola data siswa
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/prediksi">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                                <CardTitle className="text-base">Prediksi KNN</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Jalankan prediksi jurusan untuk siswa
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/laporan">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <FileText className="h-5 w-5 mr-2 text-green-600" />
                                <CardTitle className="text-base">Laporan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Lihat statistik dan analisis data
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    {isSuperAdmin && (
                        <Link href="/pengaturan">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                                    <CardTitle className="text-base">Pengaturan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Konfigurasi sistem dan profil
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>

                {/* Charts and Data */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Prediksi per Bulan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Prediksi per Bulan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {chartData.prediksi_per_bulan.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{item.month}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 h-2 bg-gray-200 rounded">
                                                <div 
                                                    className="h-2 bg-blue-500 rounded"
                                                    style={{ 
                                                        width: `${(item.count / Math.max(...chartData.prediksi_per_bulan.map(d => d.count), 1)) * 100}%` 
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribusi Jurusan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="h-5 w-5 mr-2" />
                                Top Prediksi Jurusan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {chartData.distribusi_jurusan.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm truncate">{item.jurusan_prediksi}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded">
                                                <div 
                                                    className="h-2 bg-green-500 rounded"
                                                    style={{ 
                                                        width: `${(item.total / Math.max(...chartData.distribusi_jurusan.map(d => d.total), 1)) * 100}%` 
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{item.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confidence Score Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Confidence Score</CardTitle>
                            <CardDescription>Tingkat kepercayaan prediksi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {chartData.confidence_score_distribution.map((item, index) => {
                                    let color = 'bg-red-500';
                                    if (item.kategori.includes('Sangat Tinggi')) color = 'bg-green-500';
                                    else if (item.kategori.includes('Tinggi')) color = 'bg-blue-500';
                                    else if (item.kategori.includes('Sedang')) color = 'bg-yellow-500';
                                    
                                    return (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{item.kategori}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded">
                                                    <div 
                                                        className={`h-2 rounded ${color}`}
                                                        style={{ 
                                                            width: `${(item.jumlah / Math.max(...chartData.confidence_score_distribution.map(d => d.jumlah), 1)) * 100}%` 
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{item.jumlah}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities.slice(0, 6).map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`p-1 rounded-full ${
                                            activity.type === 'prediksi' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            {activity.type === 'prediksi' ? 
                                                <Target className="h-3 w-3 text-green-600" /> :
                                                <Users className="h-3 w-3 text-blue-600" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 truncate">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {activity.detail} • {formatDate(activity.time)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Guru BK Specific Section */}
                {isGuruBK && roleSpecificData.jurusan_terpopuler && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Jurusan Terpopuler
                            </CardTitle>
                            <CardDescription>
                                Jurusan yang paling banyak diprediksi untuk siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {roleSpecificData.jurusan_terpopuler.map((jurusan: string, index: number) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        #{index + 1} {jurusan}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
