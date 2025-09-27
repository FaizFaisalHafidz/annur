import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Brain,
    CheckCircle,
    Filter,
    GraduationCap,
    Loader2,
    RefreshCw,
    Target,
    Users,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SurveiMinatBakat {
    id: number;
    rencana_kuliah: string;
    minat_ipa?: number;
    minat_ips?: number;
    minat_bahasa?: number;
    minat_seni?: number;
}

interface NilaiAkademik {
    id: number;
    rata_rata_keseluruhan?: number;
    matematika?: number;
    fisika?: number;
    kimia?: number;
    biologi?: number;
}

interface SiswaLengkap {
    id: number;
    nama_lengkap: string;
    nisn: string;
    nomor_induk: string;
    kelas: string;
    jenis_kelamin: string;
    nilai_akademik?: NilaiAkademik[];
    survei_minat_bakat?: SurveiMinatBakat;
}

interface Props extends SharedData {
    siswa_belum_prediksi: SiswaLengkap[];
    daftar_kelas: string[];
}

const PrediksiCreate = ({ auth, siswa_belum_prediksi, daftar_kelas }: Props) => {
    const [selectedSiswa, setSelectedSiswa] = useState<number[]>([]);
    const [filterKelas, setFilterKelas] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [classLoading, setClassLoading] = useState(false);

    const filteredSiswa = filterKelas 
        ? siswa_belum_prediksi.filter(siswa => siswa.kelas === filterKelas)
        : siswa_belum_prediksi;

    const handleSelectAll = () => {
        if (selectedSiswa.length === filteredSiswa.length) {
            setSelectedSiswa([]);
        } else {
            setSelectedSiswa(filteredSiswa.map(siswa => siswa.id));
        }
    };

    const handleSelectSiswa = (siswaId: number) => {
        setSelectedSiswa(prev => 
            prev.includes(siswaId)
                ? prev.filter(id => id !== siswaId)
                : [...prev, siswaId]
        );
    };

    const handlePredictSingle = async (siswaId: number) => {
        setIsLoading(true);
        router.post('/prediksi/single', { siswa_id: siswaId }, {
            onSuccess: (page) => {
                toast.success('Prediksi berhasil dilakukan');
                router.reload();
            },
            onError: (errors) => {
                toast.error('Gagal melakukan prediksi');
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handlePredictBulk = async () => {
        if (selectedSiswa.length === 0) {
            toast.error('Pilih siswa yang akan diprediksi');
            return;
        }

        setBulkLoading(true);
        try {
            const response = await fetch('/prediksi/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ siswa_ids: selectedSiswa })
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                setSelectedSiswa([]);
                router.reload();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat melakukan prediksi bulk');
            console.error('Error:', error);
        } finally {
            setBulkLoading(false);
        }
    };

    const handlePredictByClass = async (kelas: string) => {
        if (confirm(`Apakah Anda yakin ingin memprediksi semua siswa di kelas ${kelas}?`)) {
            setClassLoading(true);
            try {
                const response = await fetch('/prediksi/class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({ kelas })
                });

                const result = await response.json();

                if (result.success) {
                    toast.success(result.message);
                    router.reload();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Terjadi kesalahan saat melakukan prediksi per kelas');
                console.error('Error:', error);
            } finally {
                setClassLoading(false);
            }
        }
    };

    const getSiswaStatus = (siswa: SiswaLengkap) => {
        const hasNilai = siswa.nilai_akademik && siswa.nilai_akademik.length > 0;
        const hasSurvei = siswa.survei_minat_bakat;
        
        if (hasNilai && hasSurvei) {
            return { status: 'ready', color: 'text-green-600', icon: CheckCircle };
        } else {
            return { status: 'not-ready', color: 'text-red-600', icon: XCircle };
        }
    };

    const getReadySiswaInClass = (kelas: string) => {
        return siswa_belum_prediksi
            .filter(siswa => siswa.kelas === kelas)
            .filter(siswa => {
                const hasNilai = siswa.nilai_akademik && siswa.nilai_akademik.length > 0;
                const hasSurvei = siswa.survei_minat_bakat;
                return hasNilai && hasSurvei;
            }).length;
    };

    return (
        <AppLayout>
            <Head title="Buat Prediksi KNN" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Brain className="h-8 w-8 text-blue-600 mr-3" />
                                    Buat Prediksi Jurusan
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Pilih siswa yang akan diprediksi jurusan kuliahnya menggunakan algoritma KNN
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Siswa Belum Prediksi
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {siswa_belum_prediksi.length}
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
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Siap Diprediksi
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {siswa_belum_prediksi.filter(siswa => {
                                                    const hasNilai = siswa.nilai_akademik && siswa.nilai_akademik.length > 0;
                                                    const hasSurvei = siswa.survei_minat_bakat;
                                                    return hasNilai && hasSurvei;
                                                }).length}
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
                                        <Target className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Terpilih
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {selectedSiswa.length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter dan Actions */}
                    <div className="bg-white shadow-sm rounded-lg border mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Filter className="h-5 w-5 text-gray-500" />
                                        <select
                                            value={filterKelas}
                                            onChange={(e) => setFilterKelas(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Semua Kelas</option>
                                            {daftar_kelas.map(kelas => (
                                                <option key={kelas} value={kelas}>{kelas}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {selectedSiswa.length === filteredSiswa.length ? 'Batalkan Semua' : 'Pilih Semua'}
                                    </button>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {selectedSiswa.length > 0 && (
                                        <button
                                            onClick={handlePredictBulk}
                                            disabled={bulkLoading}
                                            className="inline-flex items-center px-4 py-2 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            {bulkLoading ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Target className="h-4 w-4 mr-2" />
                                            )}
                                            Prediksi Terpilih ({selectedSiswa.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prediksi per Kelas */}
                    {filterKelas && (
                        <div className="bg-white shadow-sm rounded-lg border mb-6">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                                            Prediksi Kelas {filterKelas}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {getReadySiswaInClass(filterKelas)} dari {filteredSiswa.length} siswa siap diprediksi
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handlePredictByClass(filterKelas)}
                                        disabled={classLoading || getReadySiswaInClass(filterKelas) === 0}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {classLoading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                        )}
                                        Prediksi Seluruh Kelas
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Daftar Siswa */}
                    <div className="bg-white shadow-sm rounded-lg border">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                                    Daftar Siswa {filterKelas ? `Kelas ${filterKelas}` : ''}
                                </h3>
                                <div className="text-sm text-gray-600">
                                    Menampilkan {filteredSiswa.length} siswa
                                </div>
                            </div>
                            
                            {filteredSiswa.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSiswa.length === filteredSiswa.length && filteredSiswa.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Siswa
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kelas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status Data
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredSiswa.map((siswa) => {
                                                const statusInfo = getSiswaStatus(siswa);
                                                const StatusIcon = statusInfo.icon;
                                                
                                                return (
                                                    <tr key={siswa.id} className={selectedSiswa.includes(siswa.id) ? 'bg-green-50' : ''}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSiswa.includes(siswa.id)}
                                                                onChange={() => handleSelectSiswa(siswa.id)}
                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {siswa.nama_lengkap}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {siswa.nomor_induk} • {siswa.nisn}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {siswa.kelas}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className={`flex items-center ${statusInfo.color}`}>
                                                                <StatusIcon className="h-4 w-4 mr-2" />
                                                                <span className="text-sm">
                                                                    {statusInfo.status === 'ready' ? 'Siap Prediksi' : 'Data Belum Lengkap'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handlePredictSingle(siswa.id)}
                                                                disabled={isLoading || statusInfo.status === 'not-ready'}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                            >
                                                                {isLoading ? (
                                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Target className="h-3 w-3 mr-1" />
                                                                )}
                                                                Prediksi
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p>Tidak ada siswa yang perlu diprediksi</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PrediksiCreate;