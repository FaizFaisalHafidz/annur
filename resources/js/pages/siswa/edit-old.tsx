import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
}

interface Props extends SharedData {
  siswa: Siswa;
  kelasList: string[];
  agamaList: string[];
}

const EditSiswa = ({ auth, siswa, kelasList, agamaList }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomor_induk: siswa.nomor_induk || '',
    nisn: siswa.nisn || '',
    nama_lengkap: siswa.nama_lengkap || '',
    jenis_kelamin: siswa.jenis_kelamin || '',
    tempat_lahir: siswa.tempat_lahir || '',
    tanggal_lahir: siswa.tanggal_lahir || '',
    agama: siswa.agama || '',
    anak_ke: siswa.anak_ke?.toString() || '',
    status_dalam_keluarga: siswa.status_dalam_keluarga || 'ANAK KANDUNG',
    alamat: siswa.alamat || '',
    kelas: siswa.kelas || '',
    tanggal_diterima: siswa.tanggal_diterima || '',
    semester_diterima: siswa.semester_diterima?.toString() || '1',
    asal_sekolah: siswa.asal_sekolah || '',
    alamat_asal_sekolah: siswa.alamat_asal_sekolah || '',
    tahun_ijazah: siswa.tahun_ijazah || '',
    nomor_ijazah: siswa.nomor_ijazah || '',
    tahun_sttb: siswa.tahun_sttb || '',
    nomor_sttb: siswa.nomor_sttb || '',
    nama_ayah: siswa.nama_ayah || '',
    nama_ibu: siswa.nama_ibu || '',
    alamat_orang_tua: siswa.alamat_orang_tua || '',
    pekerjaan_ayah: siswa.pekerjaan_ayah || '',
    pekerjaan_ibu: siswa.pekerjaan_ibu || '',
    nama_wali: siswa.nama_wali || '',
    alamat_wali: siswa.alamat_wali || '',
    pekerjaan_wali: siswa.pekerjaan_wali || '',
    nomor_telepon_ayah: siswa.nomor_telepon_ayah || '',
    nomor_telepon_ibu: siswa.nomor_telepon_ibu || '',
    nomor_telepon_wali: siswa.nomor_telepon_wali || '',
    is_alumni: siswa.is_alumni,
    is_aktif: siswa.is_aktif,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    router.put(`/siswa/${siswa.id}`, formData, {
      onSuccess: () => {
        toast.success('Data siswa berhasil diperbarui');
      },
      onError: (errors) => {
        toast.error('Gagal memperbarui data siswa');
        console.log(errors);
      },
      onFinish: () => {
        setLoading(false);
      }
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AppLayout>
      <Head title={`Edit Data Siswa - ${siswa.nama_lengkap}`} />
      
      <div className="py-6">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Data Siswa</h1>
                <p className="mt-2 text-gray-600">
                  Edit data siswa: {siswa.nama_lengkap}
                </p>
              </div>
              <Link
                href="/siswa"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Data Identitas Siswa</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nomor_induk">Nomor Induk *</Label>
                  <Input
                    id="nomor_induk"
                    value={formData.nomor_induk}
                    onChange={(e) => handleInputChange('nomor_induk', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nisn">NISN *</Label>
                  <Input
                    id="nisn"
                    value={formData.nisn}
                    onChange={(e) => handleInputChange('nisn', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                  <Input
                    id="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select value={formData.jenis_kelamin} onValueChange={(value) => handleInputChange('jenis_kelamin', value)}>
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
                    value={formData.tempat_lahir}
                    onChange={(e) => handleInputChange('tempat_lahir', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="agama">Agama *</Label>
                  <Select value={formData.agama} onValueChange={(value) => handleInputChange('agama', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      {agamaList.map((agama) => (
                        <SelectItem key={agama} value={agama}>{agama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="alamat">Alamat *</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('alamat', e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Status Siswa */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Status Siswa</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="kelas">Kelas *</Label>
                  <Select value={formData.kelas} onValueChange={(value) => handleInputChange('kelas', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {kelasList.map((kelas) => (
                        <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tanggal_diterima">Tanggal Diterima *</Label>
                  <Input
                    id="tanggal_diterima"
                    type="date"
                    value={formData.tanggal_diterima}
                    onChange={(e) => handleInputChange('tanggal_diterima', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="is_aktif">Status Aktif</Label>
                  <Select 
                    value={formData.is_aktif ? 'true' : 'false'} 
                    onValueChange={(value) => handleInputChange('is_aktif', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="is_alumni">Status Alumni</Label>
                  <Select 
                    value={formData.is_alumni ? 'true' : 'false'} 
                    onValueChange={(value) => handleInputChange('is_alumni', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Bukan Alumni</SelectItem>
                      <SelectItem value="true">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Data Orang Tua/Wali</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nama_ayah">Nama Ayah *</Label>
                  <Input
                    id="nama_ayah"
                    value={formData.nama_ayah}
                    onChange={(e) => handleInputChange('nama_ayah', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nama_ibu">Nama Ibu *</Label>
                  <Input
                    id="nama_ibu"
                    value={formData.nama_ibu}
                    onChange={(e) => handleInputChange('nama_ibu', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah *</Label>
                  <Input
                    id="pekerjaan_ayah"
                    value={formData.pekerjaan_ayah}
                    onChange={(e) => handleInputChange('pekerjaan_ayah', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu *</Label>
                  <Input
                    id="pekerjaan_ibu"
                    value={formData.pekerjaan_ibu}
                    onChange={(e) => handleInputChange('pekerjaan_ibu', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="alamat_orang_tua">Alamat Orang Tua *</Label>
                  <Textarea
                    id="alamat_orang_tua"
                    value={formData.alamat_orang_tua}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('alamat_orang_tua', e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/siswa"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </Link>
              <Button type="submit" disabled={loading} className="bg-green-800 hover:bg-green-900">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditSiswa;