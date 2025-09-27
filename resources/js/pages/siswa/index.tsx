import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, GraduationCap, Plus, TrendingUp, Users } from 'lucide-react';

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
              <Link
                href="/siswa/create"
                className="inline-flex items-center px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md shadow-sm text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Siswa
              </Link>
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
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DataSiswa;
