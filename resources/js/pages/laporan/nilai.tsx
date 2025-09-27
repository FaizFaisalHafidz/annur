import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BookOpen, Filter, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface NilaiLaporanProps {
    nilai: {
        data: Array<{
            id: number;
            siswa_lengkap: {
                nama_lengkap: string;
                kelas: string;
                nomor_induk: string;
            };
            rata_rata_keseluruhan: number;
            rata_rata_sem1: number;
            rata_rata_sem2: number;
            tahun_ajaran: string;
        }>;
        links: any[];
    };
    kelasList: string[];
    tahunAjaranList: string[];
    filters: {
        kelas?: string;
        tahun_ajaran?: string;
    };
}

export default function LaporanNilai({ nilai, kelasList, tahunAjaranList, filters }: NilaiLaporanProps) {
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || 'semua');
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_ajaran || 'semua');

    const handleFilter = () => {
        router.get('/laporan/nilai', {
            kelas: selectedKelas === 'semua' ? undefined : selectedKelas,
            tahun_ajaran: selectedTahun === 'semua' ? undefined : selectedTahun,
        });
    };

    const formatDecimal = (num: number) => {
        return new Intl.NumberFormat('id-ID', { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
        }).format(num);
    };

    return (
        <AppLayout>
            <Head title="Laporan Nilai Akademik" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Laporan Nilai Akademik</h1>
                        <p className="text-muted-foreground">Analisis performa akademik siswa</p>
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
                            <CardTitle className="text-sm font-medium">Rata-rata Keseluruhan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {nilai.data.length > 0 ? 
                                    formatDecimal(nilai.data.reduce((sum, n) => sum + n.rata_rata_keseluruhan, 0) / nilai.data.length)
                                    : '0'
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">Semua siswa</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nilai Tertinggi</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {nilai.data.length > 0 ? 
                                    formatDecimal(Math.max(...nilai.data.map(n => n.rata_rata_keseluruhan)))
                                    : '0'
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">Skor maksimal</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nilai Terendah</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {nilai.data.length > 0 ? 
                                    formatDecimal(Math.min(...nilai.data.map(n => n.rata_rata_keseluruhan)))
                                    : '0'
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">Skor minimal</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Siswa di atas 80</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {nilai.data.filter(n => n.rata_rata_keseluruhan >= 80).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Prestasi tinggi</p>
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
                            <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Tahun</SelectItem>
                                    {tahunAjaranList.map(tahun => (
                                        <SelectItem key={tahun} value={tahun}>{tahun}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    <TableHead>Tahun Ajaran</TableHead>
                                    <TableHead className="text-center">Rata-rata Sem 1</TableHead>
                                    <TableHead className="text-center">Rata-rata Sem 2</TableHead>
                                    <TableHead className="text-center">Rata-rata Keseluruhan</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nilai.data.map((n) => {
                                    let grade = 'D';
                                    let gradeColor = 'bg-red-100 text-red-800';
                                    
                                    if (n.rata_rata_keseluruhan >= 90) {
                                        grade = 'A';
                                        gradeColor = 'bg-green-100 text-green-800';
                                    } else if (n.rata_rata_keseluruhan >= 80) {
                                        grade = 'B';
                                        gradeColor = 'bg-blue-100 text-blue-800';
                                    } else if (n.rata_rata_keseluruhan >= 70) {
                                        grade = 'C';
                                        gradeColor = 'bg-yellow-100 text-yellow-800';
                                    }

                                    return (
                                        <TableRow key={n.id}>
                                            <TableCell>{n.siswa_lengkap.nomor_induk}</TableCell>
                                            <TableCell className="font-medium">{n.siswa_lengkap.nama_lengkap}</TableCell>
                                            <TableCell>{n.siswa_lengkap.kelas}</TableCell>
                                            <TableCell>{n.tahun_ajaran}</TableCell>
                                            <TableCell className="text-center">{formatDecimal(n.rata_rata_sem1)}</TableCell>
                                            <TableCell className="text-center">{formatDecimal(n.rata_rata_sem2)}</TableCell>
                                            <TableCell className="text-center font-medium">{formatDecimal(n.rata_rata_keseluruhan)}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${gradeColor}`}>
                                                    {grade}
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