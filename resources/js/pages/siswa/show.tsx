import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, GraduationCap, MapPin, Phone, User, Users } from 'lucide-react';

interface Siswa {
  id: number;
  nomor_induk: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: string;
  anak_ke?: number;
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
  is_alumni: boolean;
  is_aktif: boolean;
  created_at: string;
  updated_at: string;
}

interface NilaiAkademik {
  id: number;
  siswa_lengkap_id: number;
  pabp_sem1: number;
  ppkn_sem1: number;
  bahasa_indonesia_sem1: number;
  matematika_wajib_sem1: number;
  sejarah_indonesia_sem1: number;
  bahasa_inggris_sem1: number;
  seni_budaya_sem1: number;
  pjok_sem1: number;
  prakarya_sem1: number;
  bahasa_sunda_sem1: number;
  geografi_sem1: number;
  sejarah_sem1: number;
  sosiologi_sem1: number;
  ekonomi_sem1: number;
  bahasa_arab_sem1: number;
  ilmu_akhlak_sem1: number;
  pabp_sem2: number;
  ppkn_sem2: number;
  bahasa_indonesia_sem2: number;
  matematika_wajib_sem2: number;
  sejarah_indonesia_sem2: number;
  bahasa_inggris_sem2: number;
  seni_budaya_sem2: number;
  pjok_sem2: number;
  prakarya_sem2: number;
  bahasa_sunda_sem2: number;
  geografi_sem2: number;
  sejarah_sem2: number;
  sosiologi_sem2: number;
  ekonomi_sem2: number;
  bahasa_arab_sem2: number;
  ilmu_akhlak_sem2: number;
  total_sem1: number;
  total_sem2: number;
  total_keseluruhan: number;
  rata_rata_sem1: string;
  rata_rata_sem2: string;
  rata_rata_keseluruhan: string;
  tahun_ajaran: string;
  kelas: string;
  created_at: string;
  updated_at: string;
}

interface SurveiMinatBakat {
  id: number;
  siswa_lengkap_id: number;
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
  tanggal_survei: string;
  created_at: string;
  updated_at: string;
}

interface Props extends SharedData {
  siswa: Siswa & {
    nilai_akademik?: NilaiAkademik[];
    survei_minat_bakat?: SurveiMinatBakat;
  };
}

const ShowSiswa = ({ auth, siswa }: Props) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <AppLayout>
      <Head title={`Detail Siswa - ${siswa.nama_lengkap}`} />
      
      <div className="py-6">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detail Data Siswa</h1>
                <p className="mt-2 text-gray-600">
                  Informasi lengkap siswa: {siswa.nama_lengkap}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/siswa/${siswa.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md shadow-sm text-sm font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Data
                </Link>
                <Link
                  href="/siswa"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Informasi Singkat */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{siswa.nama_lengkap}</CardTitle>
                      <CardDescription>
                        {siswa.nomor_induk} • {siswa.kelas}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Badge variant={siswa.is_aktif ? "default" : "secondary"}>
                      {siswa.is_aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    {siswa.is_alumni && (
                      <Badge variant="outline">Alumni</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Umur: {calculateAge(siswa.tanggal_lahir)} tahun
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      NISN: {siswa.nisn}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {siswa.tempat_lahir}, {formatDate(siswa.tanggal_lahir)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {siswa.jenis_kelamin} • {siswa.agama}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Data Identitas */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Identitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nomor Induk</label>
                      <p className="text-gray-900">{siswa.nomor_induk}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NISN</label>
                      <p className="text-gray-900">{siswa.nisn}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                      <p className="text-gray-900">{siswa.nama_lengkap}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                      <p className="text-gray-900">{siswa.jenis_kelamin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Agama</label>
                      <p className="text-gray-900">{siswa.agama}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tempat, Tanggal Lahir</label>
                      <p className="text-gray-900">{siswa.tempat_lahir}, {formatDate(siswa.tanggal_lahir)}</p>
                    </div>
                    {siswa.anak_ke && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Anak Ke</label>
                        <p className="text-gray-900">{siswa.anak_ke}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Status dalam Keluarga</label>
                      <p className="text-gray-900">{siswa.status_dalam_keluarga}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Alamat</label>
                      <p className="text-gray-900">{siswa.alamat}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Sekolah */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Sekolah</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kelas</label>
                      <p className="text-gray-900">{siswa.kelas}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tanggal Diterima</label>
                      <p className="text-gray-900">{formatDate(siswa.tanggal_diterima)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Semester Diterima</label>
                      <p className="text-gray-900">Semester {siswa.semester_diterima}</p>
                    </div>
                    {siswa.asal_sekolah && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Asal Sekolah</label>
                        <p className="text-gray-900">{siswa.asal_sekolah}</p>
                      </div>
                    )}
                    {siswa.alamat_asal_sekolah && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Alamat Asal Sekolah</label>
                        <p className="text-gray-900">{siswa.alamat_asal_sekolah}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Data Ijazah & STTB */}
              {(siswa.tahun_ijazah || siswa.nomor_ijazah || siswa.tahun_sttb || siswa.nomor_sttb) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Ijazah & STTB</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {siswa.tahun_ijazah && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tahun Ijazah</label>
                          <p className="text-gray-900">{siswa.tahun_ijazah}</p>
                        </div>
                      )}
                      {siswa.nomor_ijazah && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Nomor Ijazah</label>
                          <p className="text-gray-900">{siswa.nomor_ijazah}</p>
                        </div>
                      )}
                      {siswa.tahun_sttb && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tahun STTB</label>
                          <p className="text-gray-900">{siswa.tahun_sttb}</p>
                        </div>
                      )}
                      {siswa.nomor_sttb && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Nomor STTB</label>
                          <p className="text-gray-900">{siswa.nomor_sttb}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Data Orang Tua */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Data Orang Tua / Wali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Data Ayah */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Data Ayah</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Ayah</label>
                    <p className="text-gray-900">{siswa.nama_ayah}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pekerjaan</label>
                    <p className="text-gray-900">{siswa.pekerjaan_ayah}</p>
                  </div>
                  {siswa.nomor_telepon_ayah && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {siswa.nomor_telepon_ayah}
                      </p>
                    </div>
                  )}
                </div>

                {/* Data Ibu */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Data Ibu</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Ibu</label>
                    <p className="text-gray-900">{siswa.nama_ibu}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pekerjaan</label>
                    <p className="text-gray-900">{siswa.pekerjaan_ibu}</p>
                  </div>
                  {siswa.nomor_telepon_ibu && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {siswa.nomor_telepon_ibu}
                      </p>
                    </div>
                  )}
                </div>

                {/* Data Wali */}
                {(siswa.nama_wali || siswa.pekerjaan_wali || siswa.alamat_wali || siswa.nomor_telepon_wali) && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Data Wali</h4>
                    {siswa.nama_wali && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nama Wali</label>
                        <p className="text-gray-900">{siswa.nama_wali}</p>
                      </div>
                    )}
                    {siswa.pekerjaan_wali && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pekerjaan</label>
                        <p className="text-gray-900">{siswa.pekerjaan_wali}</p>
                      </div>
                    )}
                    {siswa.alamat_wali && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Alamat Wali</label>
                        <p className="text-gray-900">{siswa.alamat_wali}</p>
                      </div>
                    )}
                    {siswa.nomor_telepon_wali && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {siswa.nomor_telepon_wali}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div>
                <label className="text-sm font-medium text-gray-500">Alamat Orang Tua</label>
                <p className="text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-1 mt-1 flex-shrink-0" />
                  {siswa.alamat_orang_tua}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Nilai Akademik */}
          {siswa.nilai_akademik && siswa.nilai_akademik.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Data Nilai Akademik</CardTitle>
                <CardDescription>
                  Riwayat nilai akademik siswa per mata pelajaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                {siswa.nilai_akademik.map((nilaiRecord) => (
                  <div key={nilaiRecord.id} className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">Tahun Ajaran {nilaiRecord.tahun_ajaran}</h4>
                      <Badge variant="outline">{nilaiRecord.kelas}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Semester 1 */}
                      <div>
                        <h5 className="text-md font-medium mb-3 text-blue-600">Semester 1</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mata Pelajaran
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nilai
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr><td className="px-4 py-2 text-sm">PAI & BP</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.pabp_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">PPKn</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ppkn_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Indonesia</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_indonesia_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Matematika Wajib</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.matematika_wajib_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sejarah Indonesia</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sejarah_indonesia_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Inggris</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_inggris_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Seni Budaya</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.seni_budaya_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">PJOK</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.pjok_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Prakarya</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.prakarya_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Sunda</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_sunda_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Geografi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.geografi_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sejarah</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sejarah_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sosiologi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sosiologi_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Ekonomi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ekonomi_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Arab</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_arab_sem1}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Ilmu Akhlak</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ilmu_akhlak_sem1}</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm"><strong>Rata-rata:</strong> {nilaiRecord.rata_rata_sem1}</p>
                        </div>
                      </div>

                      {/* Semester 2 */}
                      <div>
                        <h5 className="text-md font-medium mb-3 text-green-600">Semester 2</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mata Pelajaran
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nilai
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr><td className="px-4 py-2 text-sm">PAI & BP</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.pabp_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">PPKn</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ppkn_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Indonesia</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_indonesia_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Matematika Wajib</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.matematika_wajib_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sejarah Indonesia</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sejarah_indonesia_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Inggris</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_inggris_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Seni Budaya</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.seni_budaya_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">PJOK</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.pjok_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Prakarya</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.prakarya_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Sunda</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_sunda_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Geografi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.geografi_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sejarah</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sejarah_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Sosiologi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.sosiologi_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Ekonomi</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ekonomi_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Bahasa Arab</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.bahasa_arab_sem2}</td></tr>
                              <tr><td className="px-4 py-2 text-sm">Ilmu Akhlak</td><td className="px-4 py-2 text-sm font-semibold">{nilaiRecord.ilmu_akhlak_sem2}</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-2 p-2 bg-green-50 rounded">
                          <p className="text-sm"><strong>Rata-rata:</strong> {nilaiRecord.rata_rata_sem2}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Semester 1</p>
                          <p className="text-lg font-bold text-blue-600">{nilaiRecord.total_sem1}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Semester 2</p>
                          <p className="text-lg font-bold text-green-600">{nilaiRecord.total_sem2}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rata-rata Keseluruhan</p>
                          <p className="text-xl font-bold text-purple-600">{nilaiRecord.rata_rata_keseluruhan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Data Survei Minat Bakat */}
          {siswa.survei_minat_bakat && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Data Survei Minat & Bakat</CardTitle>
                <CardDescription>
                  Hasil survei minat dan bakat siswa untuk prediksi jurusan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mata Pelajaran Diminati</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {siswa.survei_minat_bakat.mata_pelajaran_diminati.map((mapel, index) => (
                          <Badge key={index} variant="secondary">{mapel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Alasan Minat Mata Pelajaran</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.alasan_minat_mapel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rencana Kuliah</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.rencana_kuliah}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Jurusan Diminati</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.jurusan_diminati}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Alasan Pilih Jurusan</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.alasan_pilih_jurusan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kategori Jurusan</label>
                      <Badge variant="outline">{siswa.survei_minat_bakat.kategori_jurusan}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tahu Universitas</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.tahu_universitas}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ekstrakurikuler</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.ekstrakurikuler}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pengaruh Ekstrakurikuler</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.ekstrakurikuler_pengaruh}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pengaruh Keputusan</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.pengaruh_keputusan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pernah Tes Minat</label>
                      <p className="text-gray-900">{siswa.survei_minat_bakat.pernah_tes_minat}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tingkat Keyakinan</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(siswa.survei_minat_bakat.tingkat_keyakinan / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{siswa.survei_minat_bakat.tingkat_keyakinan}/5</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tanggal Survei</label>
                      <p className="text-gray-900">{formatDate(siswa.survei_minat_bakat.tanggal_survei)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informasi Sistem */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Dibuat</label>
                  <p>{formatDate(siswa.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Terakhir Diperbarui</label>
                  <p>{formatDate(siswa.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShowSiswa;