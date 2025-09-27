import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, BookOpen, GraduationCap, Target, TrendingUp, Users } from 'lucide-react';

interface LaporanIndexProps {
    statistik: {
        totalSiswa: number;
        totalSiswaAktif: number;
        totalPrediksi: number;
        totalNilai: number;
        totalSurvei: number;
    };
    distribusiKelas: Array<{
        kelas: string;
        total: number;
    }>;
    distribusiGender: Array<{
        jenis_kelamin: string;
        total: number;
    }>;
    prediksiPopuler: Array<{
        jurusan_prediksi: string;
        total: number;
    }>;
    rataNilaiSem1: {
        avg_pabp: number;
        avg_ppkn: number;
        avg_bahasa_indonesia: number;
        avg_matematika: number;
        avg_sejarah_indonesia: number;
        avg_bahasa_inggris: number;
        avg_seni_budaya: number;
        avg_pjok: number;
        avg_prakarya: number;
        avg_bahasa_sunda: number;
        avg_geografi: number;
        avg_sejarah: number;
        avg_sosiologi: number;
        avg_ekonomi: number;
        avg_bahasa_arab: number;
        avg_ilmu_akhlak: number;
    };
    minatPopuler: Array<{
        kategori_jurusan: string;
        total: number;
    }>;
}

export default function LaporanIndex({
    statistik,
    distribusiKelas,
    distribusiGender,
    prediksiPopuler,
    rataNilaiSem1,
    minatPopuler
}: LaporanIndexProps) {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatDecimal = (num: number) => {
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
        }).format(num);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Laporan" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard Laporan</h1>
                        <p className="text-muted-foreground">
                            Ringkasan statistik dan analytics sistem prediksi jurusan
                        </p>
                    </div>
                </div>

                {/* Statistik Umum */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistik.totalSiswa)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(statistik.totalSiswaAktif)} siswa aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Prediksi Selesai</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistik.totalPrediksi)}</div>
                            <p className="text-xs text-muted-foreground">
                                Hasil prediksi KNN
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Data Nilai</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistik.totalNilai)}</div>
                            <p className="text-xs text-muted-foreground">
                                Nilai akademik siswa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Data Survei</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistik.totalSurvei)}</div>
                            <p className="text-xs text-muted-foreground">
                                Survei minat & bakat
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistik.totalSiswa > 0 ? 
                                    formatDecimal((statistik.totalPrediksi / statistik.totalSiswa) * 100) : '0'
                                }%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Siswa dengan prediksi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/laporan/siswa">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <Users className="h-5 w-5 mr-2" />
                                <CardTitle className="text-base">Laporan Siswa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Data lengkap siswa dengan filter kelas dan status
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/laporan/nilai">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <BookOpen className="h-5 w-5 mr-2" />
                                <CardTitle className="text-base">Laporan Nilai</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Analisis nilai akademik per mata pelajaran
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/laporan/prediksi">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <Target className="h-5 w-5 mr-2" />
                                <CardTitle className="text-base">Laporan Prediksi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Hasil prediksi KNN dan analisis akurasi
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <Download className="h-5 w-5 mr-2" />
                            <CardTitle className="text-base">Export Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Download laporan dalam format PDF/Excel
                            </p>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Charts dan Statistics */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Distribusi Kelas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Distribusi Siswa per Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {distribusiKelas.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{item.kelas}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 h-2 bg-gray-200 rounded">
                                                <div 
                                                    className="h-2 bg-blue-500 rounded"
                                                    style={{ 
                                                        width: `${(item.total / Math.max(...distribusiKelas.map(d => d.total))) * 100}%` 
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

                    {/* Distribusi Gender */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Jenis Kelamin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {distribusiGender.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{item.jenis_kelamin}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-4 bg-gray-200 rounded">
                                                <div 
                                                    className={`h-4 rounded ${
                                                        item.jenis_kelamin === 'Laki-laki' ? 'bg-blue-500' : 'bg-pink-500'
                                                    }`}
                                                    style={{ 
                                                        width: `${(item.total / statistik.totalSiswa) * 100}%` 
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {item.total} ({formatDecimal((item.total / statistik.totalSiswa) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prediksi Jurusan Populer */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 Prediksi Jurusan</CardTitle>
                            <CardDescription>Jurusan yang paling banyak diprediksi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {prediksiPopuler.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{item.jurusan_prediksi}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded">
                                                <div 
                                                    className="h-2 bg-green-500 rounded"
                                                    style={{ 
                                                        width: `${(item.total / Math.max(...prediksiPopuler.map(d => d.total))) * 100}%` 
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

                    {/* Minat Kategori Populer */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori Minat Populer</CardTitle>
                            <CardDescription>Berdasarkan survei minat & bakat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {minatPopuler.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{item.kategori_jurusan}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded">
                                                <div 
                                                    className="h-2 bg-purple-500 rounded"
                                                    style={{ 
                                                        width: `${(item.total / Math.max(...minatPopuler.map(d => d.total))) * 100}%` 
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
                </div>

                {/* Rata-rata Nilai Akademik */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rata-rata Nilai Akademik Semester 1</CardTitle>
                        <CardDescription>Performa akademik keseluruhan siswa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {rataNilaiSem1 && Object.entries(rataNilaiSem1).map(([key, value], index) => {
                                if (key.startsWith('avg_') && value !== null) {
                                    const mataPelajaran = key.replace('avg_', '').replace(/_/g, ' ').toUpperCase();
                                    return (
                                        <div key={index} className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {formatDecimal(value)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {mataPelajaran}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}