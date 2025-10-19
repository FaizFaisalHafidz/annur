import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Download, FileText, GraduationCap, Plus, TrendingUp, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SiswaLengkap {
  id: number;
  nomor_induk: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kelas: string;
  is_aktif: boolean;
  is_alumni: boolean;
}

interface Props extends SharedData {
  siswa: {
    data: SiswaLengkap[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  stats: {
    total_siswa: number;
    aktif: number;
    alumni: number;
    rencana_kuliah: {
      iya: number;
    };
  };
}

const DataSiswa = ({ auth, siswa, stats }: Props) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm<{
    file: File | null;
  }>({
    file: null,
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.file) {
      toast.error('Silakan pilih file Excel terlebih dahulu');
      return;
    }

    post('/siswa-import', {
      onSuccess: () => {
        setImportDialogOpen(false);
        reset();
        toast.success('Data siswa berhasil diimpor');
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat mengimpor data');
      },
    });
  };

  const handleExport = () => {
    window.open('/siswa-export', '_blank');
    toast.success('Export data siswa dimulai...');
  };

  const handleDownloadTemplate = () => {
    window.open('/siswa-template', '_blank');
    toast.success('Download template dimulai...');
  };

  return (
    <AppLayout>
      <Head title="Data Siswa" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Siswa</h1>
                <p className="mt-2 text-gray-600">
                  Kelola data lengkap siswa dengan nilai akademik dan survei minat bakat
                </p>
              </div>
              <div className="flex space-x-3">
                {/* Import Button */}
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Excel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Data Siswa</DialogTitle>
                      <DialogDescription>
                        Upload file Excel dengan data siswa, nilai akademik, dan survei minat bakat
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleImport} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">File Excel (.xlsx, .xls, .csv)</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={(e) => setData('file', e.target.files?.[0] || null)}
                          required
                        />
                        {errors.file && (
                          <p className="text-sm text-red-600">{errors.file}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setImportDialogOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                          {processing ? 'Mengimpor...' : 'Import'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Export Button */}
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>

                {/* Template Button */}
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>

                {/* Add Student Button */}
                <Link href="/siswa/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Siswa
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Siswa
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stats.total_siswa}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Siswa Aktif
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stats.aktif}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Alumni
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stats.alumni}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Ingin Kuliah
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stats.rencana_kuliah.iya}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Siswa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis Kelamin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {siswa.data.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.nama_lengkap}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.nomor_induk} • {item.nisn}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.kelas}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.jenis_kelamin === "Laki-laki" 
                              ? "bg-cyan-100 text-cyan-800" 
                              : "bg-pink-100 text-pink-800"
                          }`}>
                            {item.jenis_kelamin === "Laki-laki" ? "L" : "P"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.is_alumni ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Alumni
                            </span>
                          ) : item.is_aktif ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Tidak Aktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              href={`/siswa/${item.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Lihat
                            </Link>
                            <Link
                              href={`/siswa/${item.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Info - Always show */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Menampilkan {siswa.from || 1} hingga {siswa.to || siswa.data.length} dari {siswa.total || siswa.data.length} data siswa
                    {siswa.last_page && siswa.last_page > 1 && (
                      <span className="ml-2">
                        (Halaman {siswa.current_page || 1} dari {siswa.last_page})
                      </span>
                    )}
                  </div>
                  
                  {/* Pagination Navigation - Only show if more than 1 page */}
                  {siswa.links && siswa.last_page > 1 && (
                    <div className="flex items-center space-x-2">
                      {siswa.links.map((link, index) => {
                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                          return (
                            <Link
                              key={index}
                              href={link.url || '#'}
                              className={`px-3 py-2 text-sm rounded-md border ${
                                link.url
                                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                              preserveState
                            >
                              {link.label === '&laquo; Previous' ? 'Sebelumnya' : 'Selanjutnya'}
                            </Link>
                          );
                        }
                        
                        if (link.label === '...') {
                          return (
                            <span key={index} className="px-3 py-2 text-sm text-gray-500">
                              ...
                            </span>
                          );
                        }
                        
                        return (
                          <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-2 text-sm rounded-md border ${
                              link.active
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            preserveState
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DataSiswa;
