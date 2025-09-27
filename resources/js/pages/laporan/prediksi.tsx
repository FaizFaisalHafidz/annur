import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Award, Filter, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface PrediksiLaporanProps {
    prediksi: {
        data: Array<{
            id: number;
            siswa_lengkap: {
                nama_lengkap: string;
                kelas: string;
                nomor_induk: string;
            };
            jurusan_prediksi: string;
            confidence_score: number;
            tanggal_prediksi: string;
        }>;
        links: any[];
    };
    jurusanList: string[];
    kelasList: string[];
    statistikAkurasi: {
        rata_rata: number;
        tertinggi: number;
        terendah: number;
        total: number;
    };
    filters: {
        jurusan?: string;
        confidence_min?: string;
        kelas?: string;
    };
}

export default function LaporanPrediksi({ prediksi, jurusanList, kelasList, statistikAkurasi, filters }: PrediksiLaporanProps) {
    const [selectedJurusan, setSelectedJurusan] = useState(filters.jurusan || 'semua');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || 'semua');
    const [minConfidence, setMinConfidence] = useState(filters.confidence_min || '');

    const handleFilter = () => {
        router.get('/laporan/prediksi', {
            jurusan: selectedJurusan === 'semua' ? undefined : selectedJurusan,
            kelas: selectedKelas === 'semua' ? undefined : selectedKelas,
            confidence_min: minConfidence || undefined,
        });
    };

    const formatDecimal = (num: number) => {
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
        }).format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    return (
        <AppLayout>
            <Head title="Laporan Prediksi Jurusan" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Laporan Prediksi Jurusan</h1>
                        <p className="text-muted-foreground">Hasil prediksi K-NN dan analisis akurasi</p>
                    </div>
                    {/* <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button> */}
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Prediksi</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistikAkurasi.total}</div>
                            <p className="text-xs text-muted-foreground">Prediksi selesai</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Akurasi</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatDecimal(statistikAkurasi.rata_rata)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Performa model</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Akurasi Tertinggi</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatDecimal(statistikAkurasi.tertinggi)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Best case</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Akurasi Terendah</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatDecimal(statistikAkurasi.terendah)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Perlu perbaikan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filter Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Select value={selectedJurusan} onValueChange={setSelectedJurusan}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Pilih Jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Jurusan</SelectItem>
                                    {jurusanList.map(jurusan => (
                                        <SelectItem key={jurusan} value={jurusan}>{jurusan}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Kelas</SelectItem>
                                    {kelasList.map(kelas => (
                                        <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                placeholder="Min. confidence (%)"
                                value={minConfidence}
                                onChange={(e) => setMinConfidence(e.target.value)}
                                className="w-40"
                            />
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Induk</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Jurusan Prediksi</TableHead>
                                    <TableHead className="text-center">Confidence</TableHead>
                                    <TableHead className="text-center">Tanggal</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prediksi.data.map((p) => {
                                    let statusColor = 'bg-red-100 text-red-800';
                                    let status = 'Rendah';
                                    const confidencePercent = p.confidence_score * 100;
                                    
                                    if (confidencePercent >= 85) {
                                        status = 'Sangat Tinggi';
                                        statusColor = 'bg-green-100 text-green-800';
                                    } else if (confidencePercent >= 75) {
                                        status = 'Tinggi';
                                        statusColor = 'bg-blue-100 text-blue-800';
                                    } else if (confidencePercent >= 65) {
                                        status = 'Sedang';
                                        statusColor = 'bg-yellow-100 text-yellow-800';
                                    }

                                    return (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.siswa_lengkap.nomor_induk}</TableCell>
                                            <TableCell className="font-medium">{p.siswa_lengkap.nama_lengkap}</TableCell>
                                            <TableCell>{p.siswa_lengkap.kelas}</TableCell>
                                            <TableCell className="font-medium">{p.jurusan_prediksi}</TableCell>
                                            <TableCell className="text-center font-medium">
                                                {formatDecimal(confidencePercent)}%
                                            </TableCell>
                                            <TableCell className="text-center">{formatDate(p.tanggal_prediksi)}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                                                    {status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}