import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface SiswaData {
    id: number;
    nomor_induk: string;
    nisn: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    anak_ke: number;
    status_dalam_keluarga: string;
    alamat: string;
    kelas: string;
    tanggal_diterima: string;
    semester_diterima: number;
    asal_sekolah?: string;
    alamat_asal_sekolah?: string;
    tahun_ijazah?: string;
    nomor_ijazah?: string;
    tahun_sttb?: string;
    nomor_sttb?: string;
    nama_ayah: string;
    nama_ibu: string;
    alamat_orang_tua: string;
    pekerjaan_ayah: string;
    pekerjaan_ibu: string;
    nama_wali?: string;
    alamat_wali?: string;
    pekerjaan_wali?: string;
    nomor_telepon_ayah?: string;
    nomor_telepon_ibu?: string;
    nomor_telepon_wali?: string;
    nilai_akademik?: Array<{
        pabp_sem1: number; ppkn_sem1: number; bahasa_indonesia_sem1: number; matematika_wajib_sem1: number;
        sejarah_indonesia_sem1: number; bahasa_inggris_sem1: number; seni_budaya_sem1: number; pjok_sem1: number;
        prakarya_sem1: number; bahasa_sunda_sem1: number; geografi_sem1: number; sejarah_sem1: number;
        sosiologi_sem1: number; ekonomi_sem1: number; bahasa_arab_sem1: number; ilmu_akhlak_sem1: number;
        pabp_sem2: number; ppkn_sem2: number; bahasa_indonesia_sem2: number; matematika_wajib_sem2: number;
        sejarah_indonesia_sem2: number; bahasa_inggris_sem2: number; seni_budaya_sem2: number; pjok_sem2: number;
        prakarya_sem2: number; bahasa_sunda_sem2: number; geografi_sem2: number; sejarah_sem2: number;
        sosiologi_sem2: number; ekonomi_sem2: number; bahasa_arab_sem2: number; ilmu_akhlak_sem2: number;
        tahun_ajaran: string;
    }>;
    survei_minat_bakat?: {
        mata_pelajaran_diminati: string[];
        alasan_minat_mapel: string;
        rencana_kuliah: string;
        jurusan_diminati: string;
        alasan_pilih_jurusan: string;
        kategori_jurusan: string;
        tahu_universitas: string;
        ekstrakurikuler: string;
        ekstrakurikuler_pengaruh: string;
        pengaruh_keputusan: string;
        pernah_tes_minat: string;
        tingkat_keyakinan: number;
    };
}

interface Props {
    siswa: SiswaData;
}

export default function Edit({ siswa }: Props) {
    const nilaiAkademik = (siswa.nilai_akademik?.[0] || {}) as any;
    const surveiMinatBakat = (siswa.survei_minat_bakat || {}) as any;

    const { data, setData, put, processing, errors, reset } = useForm({
        // Data Siswa
        nomor_induk: siswa.nomor_induk || '',
        nisn: siswa.nisn || '',
        nama_lengkap: siswa.nama_lengkap || '',
        jenis_kelamin: siswa.jenis_kelamin || '',
        tempat_lahir: siswa.tempat_lahir || '',
        tanggal_lahir: siswa.tanggal_lahir ? siswa.tanggal_lahir.split('T')[0] : '',
        agama: siswa.agama || 'ISLAM',
        anak_ke: siswa.anak_ke || 1,
        status_dalam_keluarga: siswa.status_dalam_keluarga || 'ANAK KANDUNG',
        alamat: siswa.alamat || '',
        kelas: siswa.kelas || '',
        tanggal_diterima: siswa.tanggal_diterima ? siswa.tanggal_diterima.split('T')[0] : '',
        semester_diterima: siswa.semester_diterima || 1,
        nama_ayah: siswa.nama_ayah || '',
        nama_ibu: siswa.nama_ibu || '',
        alamat_orang_tua: siswa.alamat_orang_tua || '',
        pekerjaan_ayah: siswa.pekerjaan_ayah || '',
        pekerjaan_ibu: siswa.pekerjaan_ibu || '',
        
        // Data Nilai Akademik (untuk semester 1 dan 2)
        pabp_sem1: nilaiAkademik.pabp_sem1 || 0,
        ppkn_sem1: nilaiAkademik.ppkn_sem1 || 0,
        bahasa_indonesia_sem1: nilaiAkademik.bahasa_indonesia_sem1 || 0,
        matematika_wajib_sem1: nilaiAkademik.matematika_wajib_sem1 || 0,
        sejarah_indonesia_sem1: nilaiAkademik.sejarah_indonesia_sem1 || 0,
        bahasa_inggris_sem1: nilaiAkademik.bahasa_inggris_sem1 || 0,
        seni_budaya_sem1: nilaiAkademik.seni_budaya_sem1 || 0,
        pjok_sem1: nilaiAkademik.pjok_sem1 || 0,
        prakarya_sem1: nilaiAkademik.prakarya_sem1 || 0,
        bahasa_sunda_sem1: nilaiAkademik.bahasa_sunda_sem1 || 0,
        geografi_sem1: nilaiAkademik.geografi_sem1 || 0,
        sejarah_sem1: nilaiAkademik.sejarah_sem1 || 0,
        sosiologi_sem1: nilaiAkademik.sosiologi_sem1 || 0,
        ekonomi_sem1: nilaiAkademik.ekonomi_sem1 || 0,
        bahasa_arab_sem1: nilaiAkademik.bahasa_arab_sem1 || 0,
        ilmu_akhlak_sem1: nilaiAkademik.ilmu_akhlak_sem1 || 0,
        
        pabp_sem2: nilaiAkademik.pabp_sem2 || 0,
        ppkn_sem2: nilaiAkademik.ppkn_sem2 || 0,
        bahasa_indonesia_sem2: nilaiAkademik.bahasa_indonesia_sem2 || 0,
        matematika_wajib_sem2: nilaiAkademik.matematika_wajib_sem2 || 0,
        sejarah_indonesia_sem2: nilaiAkademik.sejarah_indonesia_sem2 || 0,
        bahasa_inggris_sem2: nilaiAkademik.bahasa_inggris_sem2 || 0,
        seni_budaya_sem2: nilaiAkademik.seni_budaya_sem2 || 0,
        pjok_sem2: nilaiAkademik.pjok_sem2 || 0,
        prakarya_sem2: nilaiAkademik.prakarya_sem2 || 0,
        bahasa_sunda_sem2: nilaiAkademik.bahasa_sunda_sem2 || 0,
        geografi_sem2: nilaiAkademik.geografi_sem2 || 0,
        sejarah_sem2: nilaiAkademik.sejarah_sem2 || 0,
        sosiologi_sem2: nilaiAkademik.sosiologi_sem2 || 0,
        ekonomi_sem2: nilaiAkademik.ekonomi_sem2 || 0,
        bahasa_arab_sem2: nilaiAkademik.bahasa_arab_sem2 || 0,
        ilmu_akhlak_sem2: nilaiAkademik.ilmu_akhlak_sem2 || 0,
        
        tahun_ajaran: nilaiAkademik.tahun_ajaran || '2022/2023',
        
        // Data Survei Minat Bakat
        mata_pelajaran_diminati: surveiMinatBakat.mata_pelajaran_diminati || [] as string[],
        alasan_minat_mapel: surveiMinatBakat.alasan_minat_mapel || '',
        rencana_kuliah: surveiMinatBakat.rencana_kuliah || '',
        jurusan_diminati: surveiMinatBakat.jurusan_diminati || '',
        alasan_pilih_jurusan: surveiMinatBakat.alasan_pilih_jurusan || '',
        kategori_jurusan: surveiMinatBakat.kategori_jurusan || '',
        tahu_universitas: surveiMinatBakat.tahu_universitas || '',
        ekstrakurikuler: surveiMinatBakat.ekstrakurikuler || '',
        ekstrakurikuler_pengaruh: surveiMinatBakat.ekstrakurikuler_pengaruh || '',
        pengaruh_keputusan: surveiMinatBakat.pengaruh_keputusan || '',
        pernah_tes_minat: surveiMinatBakat.pernah_tes_minat || '',
        tingkat_keyakinan: surveiMinatBakat.tingkat_keyakinan || 3,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/siswa/${siswa.id}`, {
            preserveScroll: true,
        });
    };

    const mataPelajaranOptions = [
        'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi',
        'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi', 'PABP', 'PKN', 'Seni Budaya',
        'Prakarya', 'PJOK', 'Bahasa Sunda', 'Bahasa Arab', 'Ilmu Akhlak'
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Data Siswa', href: '/siswa' },
            { title: 'Edit Siswa', href: '' }
        ]}>
            <Head title={`Edit Siswa - ${siswa.nama_lengkap}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Data Siswa</CardTitle>
                            <CardDescription>Edit data siswa, nilai akademik, dan survei minat bakat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Tabs defaultValue="biodata" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="biodata">Data Siswa</TabsTrigger>
                                        <TabsTrigger value="nilai">Nilai Akademik</TabsTrigger>
                                        <TabsTrigger value="survei">Minat & Bakat</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="biodata" className="space-y-6 mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nomor_induk">Nomor Induk *</Label>
                                                <Input
                                                    id="nomor_induk"
                                                    type="text"
                                                    value={data.nomor_induk}
                                                    onChange={(e) => setData('nomor_induk', e.target.value)}
                                                    className={errors.nomor_induk ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nisn">NISN *</Label>
                                                <Input
                                                    id="nisn"
                                                    type="text"
                                                    value={data.nisn}
                                                    onChange={(e) => setData('nisn', e.target.value)}
                                                    className={errors.nisn ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                                                <Input
                                                    id="nama_lengkap"
                                                    type="text"
                                                    value={data.nama_lengkap}
                                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                    className={errors.nama_lengkap ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                                                <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                                                <Input
                                                    id="tempat_lahir"
                                                    type="text"
                                                    value={data.tempat_lahir}
                                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                    className={errors.tempat_lahir ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                                                <Input
                                                    id="tanggal_lahir"
                                                    type="date"
                                                    value={data.tanggal_lahir}
                                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                    className={errors.tanggal_lahir ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="kelas">Kelas *</Label>
                                                <Input
                                                    id="kelas"
                                                    type="text"
                                                    value={data.kelas}
                                                    onChange={(e) => setData('kelas', e.target.value)}
                                                    className={errors.kelas ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="tanggal_diterima">Tanggal Diterima *</Label>
                                                <Input
                                                    id="tanggal_diterima"
                                                    type="date"
                                                    value={data.tanggal_diterima}
                                                    onChange={(e) => setData('tanggal_diterima', e.target.value)}
                                                    className={errors.tanggal_diterima ? 'border-red-500' : ''}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="alamat">Alamat</Label>
                                                <Textarea
                                                    id="alamat"
                                                    value={data.alamat}
                                                    onChange={(e) => setData('alamat', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="alamat_orang_tua">Alamat Orang Tua</Label>
                                                <Textarea
                                                    id="alamat_orang_tua"
                                                    value={data.alamat_orang_tua}
                                                    onChange={(e) => setData('alamat_orang_tua', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nama_ayah">Nama Ayah</Label>
                                                <Input
                                                    id="nama_ayah"
                                                    type="text"
                                                    value={data.nama_ayah}
                                                    onChange={(e) => setData('nama_ayah', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nama_ibu">Nama Ibu</Label>
                                                <Input
                                                    id="nama_ibu"
                                                    type="text"
                                                    value={data.nama_ibu}
                                                    onChange={(e) => setData('nama_ibu', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                                                <Input
                                                    id="pekerjaan_ayah"
                                                    type="text"
                                                    value={data.pekerjaan_ayah}
                                                    onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                                                <Input
                                                    id="pekerjaan_ibu"
                                                    type="text"
                                                    value={data.pekerjaan_ibu}
                                                    onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="nilai" className="space-y-6 mt-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold">Semester 1</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { key: 'pabp_sem1', label: 'PABP' },
                                                    { key: 'ppkn_sem1', label: 'PKN' },
                                                    { key: 'bahasa_indonesia_sem1', label: 'B. Indonesia' },
                                                    { key: 'matematika_wajib_sem1', label: 'Matematika' },
                                                    { key: 'sejarah_indonesia_sem1', label: 'Sejarah Indonesia' },
                                                    { key: 'bahasa_inggris_sem1', label: 'B. Inggris' },
                                                    { key: 'seni_budaya_sem1', label: 'Seni Budaya' },
                                                    { key: 'pjok_sem1', label: 'PJOK' },
                                                    { key: 'prakarya_sem1', label: 'Prakarya' },
                                                    { key: 'bahasa_sunda_sem1', label: 'B. Sunda' },
                                                    { key: 'geografi_sem1', label: 'Geografi' },
                                                    { key: 'sejarah_sem1', label: 'Sejarah' },
                                                    { key: 'sosiologi_sem1', label: 'Sosiologi' },
                                                    { key: 'ekonomi_sem1', label: 'Ekonomi' },
                                                    { key: 'bahasa_arab_sem1', label: 'B. Arab' },
                                                    { key: 'ilmu_akhlak_sem1', label: 'Ilmu Akhlak' },
                                                ].map((item) => (
                                                    <div key={item.key}>
                                                        <Label htmlFor={item.key}>{item.label}</Label>
                                                        <Input
                                                            id={item.key}
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={data[item.key as keyof typeof data]}
                                                            onChange={(e) => setData(item.key as keyof typeof data, parseInt(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold">Semester 2</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { key: 'pabp_sem2', label: 'PABP' },
                                                    { key: 'ppkn_sem2', label: 'PKN' },
                                                    { key: 'bahasa_indonesia_sem2', label: 'B. Indonesia' },
                                                    { key: 'matematika_wajib_sem2', label: 'Matematika' },
                                                    { key: 'sejarah_indonesia_sem2', label: 'Sejarah Indonesia' },
                                                    { key: 'bahasa_inggris_sem2', label: 'B. Inggris' },
                                                    { key: 'seni_budaya_sem2', label: 'Seni Budaya' },
                                                    { key: 'pjok_sem2', label: 'PJOK' },
                                                    { key: 'prakarya_sem2', label: 'Prakarya' },
                                                    { key: 'bahasa_sunda_sem2', label: 'B. Sunda' },
                                                    { key: 'geografi_sem2', label: 'Geografi' },
                                                    { key: 'sejarah_sem2', label: 'Sejarah' },
                                                    { key: 'sosiologi_sem2', label: 'Sosiologi' },
                                                    { key: 'ekonomi_sem2', label: 'Ekonomi' },
                                                    { key: 'bahasa_arab_sem2', label: 'B. Arab' },
                                                    { key: 'ilmu_akhlak_sem2', label: 'Ilmu Akhlak' },
                                                ].map((item) => (
                                                    <div key={item.key}>
                                                        <Label htmlFor={item.key}>{item.label}</Label>
                                                        <Input
                                                            id={item.key}
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={data[item.key as keyof typeof data]}
                                                            onChange={(e) => setData(item.key as keyof typeof data, parseInt(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="survei" className="space-y-6 mt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Mata Pelajaran yang Diminati</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                                    {mataPelajaranOptions.map((mapel) => (
                                                        <div key={mapel} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={mapel}
                                                                checked={data.mata_pelajaran_diminati.includes(mapel)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setData('mata_pelajaran_diminati', [...data.mata_pelajaran_diminati, mapel]);
                                                                    } else {
                                                                        setData('mata_pelajaran_diminati', data.mata_pelajaran_diminati.filter(m => m !== mapel));
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={mapel} className="text-sm">{mapel}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="alasan_minat_mapel">Alasan Minat Mata Pelajaran</Label>
                                                <Textarea
                                                    id="alasan_minat_mapel"
                                                    value={data.alasan_minat_mapel}
                                                    onChange={(e) => setData('alasan_minat_mapel', e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="rencana_kuliah">Rencana Kuliah</Label>
                                                    <Select value={data.rencana_kuliah} onValueChange={(value) => setData('rencana_kuliah', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih rencana kuliah" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Iya">Iya</SelectItem>
                                                            <SelectItem value="Tidak">Tidak</SelectItem>
                                                            <SelectItem value="Belum Tahu">Belum Tahu</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="jurusan_diminati">Jurusan yang Diminati</Label>
                                                    <Input
                                                        id="jurusan_diminati"
                                                        type="text"
                                                        value={data.jurusan_diminati}
                                                        onChange={(e) => setData('jurusan_diminati', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="tingkat_keyakinan">Tingkat Keyakinan (1-5)</Label>
                                                <Input
                                                    id="tingkat_keyakinan"
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={data.tingkat_keyakinan}
                                                    onChange={(e) => setData('tingkat_keyakinan', parseInt(e.target.value) || 3)}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                
                                <div className="flex justify-between pt-6">
                                    <Button variant="outline" asChild>
                                        <Link href="/siswa">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Update Siswa'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}