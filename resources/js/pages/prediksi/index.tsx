import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Brain,
    CheckCircle,
    Clock,
    Eye,
    Plus,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';

interface PrediksiTerbaru {
    id: number;
    jurusan_prediksi: string;
    tingkat_kepercayaan: number;
    tanggal_prediksi: string;
    siswa_lengkap: {
        id: number;
        nama_lengkap: string;
        kelas: string;
    };
}

interface DistribusiJurusan {
    jurusan_prediksi: string;
    total: number;
}

interface Props extends SharedData {
    stats: {
        total_siswa: number;
        sudah_prediksi: number;
        belum_prediksi: number;
        akurasi_model: number;
    };
    prediksi_terbaru: PrediksiTerbaru[];
    distribusi_jurusan: DistribusiJurusan[];
}

const PrediksiIndex = ({ auth, stats, prediksi_terbaru, distribusi_jurusan }: Props) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-600 bg-green-100';
        if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <AppLayout>
            <Head title="Prediksi KNN" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Brain className="h-8 w-8 text-blue-600 mr-3" />
                                    Prediksi Jurusan KNN
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Sistem prediksi jurusan kuliah menggunakan algoritma K-Nearest Neighbors
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/prediksi-knn"
                                    className="inline-flex items-center px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Buat Prediksi
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
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
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Sudah Diprediksi
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {stats.sudah_prediksi}
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
                                        <Clock className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Belum Diprediksi
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {stats.belum_prediksi}
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
                                                Akurasi Model
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {stats.akurasi_model}%
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Prediksi Terbaru */}
                        <div className="bg-white shadow-sm rounded-lg border">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                                        Prediksi Terbaru
                                    </h3>
                                    <Link
                                        href="/prediksi"
                                        className="text-sm text-green-600 hover:text-green-900"
                                    >
                                        Lihat semua
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {prediksi_terbaru.length > 0 ? (
                                        prediksi_terbaru.map((prediksi) => (
                                            <div key={prediksi.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {prediksi.siswa_lengkap.nama_lengkap}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {prediksi.siswa_lengkap.kelas}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-blue-600">
                                                                {prediksi.jurusan_prediksi}
                                                            </div>
                                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(prediksi.tingkat_kepercayaan)}`}>
                                                                {prediksi.tingkat_kepercayaan}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDate(prediksi.tanggal_prediksi)}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <Link
                                                        href={`/prediksi/${prediksi.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p>Belum ada prediksi yang dibuat</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Distribusi Jurusan */}
                        <div className="bg-white shadow-sm rounded-lg border">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                                        Distribusi Prediksi Jurusan
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {distribusi_jurusan.length > 0 ? (
                                        distribusi_jurusan.map((item, index) => {
                                            const percentage = stats.sudah_prediksi > 0 
                                                ? Math.round((item.total / stats.sudah_prediksi) * 100) 
                                                : 0;
                                            
                                            return (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {item.jurusan_prediksi}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {item.total} siswa ({percentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p>Belum ada data distribusi jurusan</p>
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

export default PrediksiIndex;