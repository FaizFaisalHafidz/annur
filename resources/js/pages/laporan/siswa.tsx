import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface SiswaLaporanProps {
    siswa: {
        data: Array<{
            id: number;
            nomor_induk: string;
            nama_lengkap: string;
            kelas: string;
            jenis_kelamin: string;
            is_aktif: boolean;
            nilai_akademik?: any;
            survei_minat_bakat?: any;
            prediksi_jurusan?: any;
        }>;
        links: any[];
    };
    kelasList: string[];
    filters: {
        kelas?: string;
        status?: string;
        gender?: string;
    };
}

export default function LaporanSiswa({ siswa, kelasList, filters }: SiswaLaporanProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || 'semua');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'semua');
    const [selectedGender, setSelectedGender] = useState(filters.gender || 'semua');

    const handleFilter = () => {
        router.get('/laporan/siswa', {
            kelas: selectedKelas === 'semua' ? undefined : selectedKelas,
            status: selectedStatus === 'semua' ? undefined : selectedStatus,
            gender: selectedGender === 'semua' ? undefined : selectedGender,
        });
    };

    const filteredSiswa = siswa.data.filter(s => 
        s.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nomor_induk.includes(searchTerm)
    );

    return (
        <AppLayout>
            <Head title="Laporan Siswa" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Laporan Siswa</h1>
                        <p className="text-muted-foreground">Data lengkap siswa dengan filter</p>
                    </div>
                    {/* <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button> */}
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
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama/nomor induk"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Kelas</SelectItem>
                                    {kelasList.map(kelas => (
                                        <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Status</SelectItem>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedGender} onValueChange={setSelectedGender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua</SelectItem>
                                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
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
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Nilai</TableHead>
                                    <TableHead>Survei</TableHead>
                                    <TableHead>Prediksi</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSiswa.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.nomor_induk}</TableCell>
                                        <TableCell className="font-medium">{s.nama_lengkap}</TableCell>
                                        <TableCell>{s.kelas}</TableCell>
                                        <TableCell>{s.jenis_kelamin}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                s.is_aktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {s.is_aktif ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                s.nilai_akademik ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {s.nilai_akademik ? 'Ada' : 'Belum'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                s.survei_minat_bakat ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {s.survei_minat_bakat ? 'Ada' : 'Belum'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                s.prediksi_jurusan ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {s.prediksi_jurusan ? 'Selesai' : 'Belum'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/siswa/${s.id}`} className="text-blue-600 hover:underline">
                                                Detail
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}