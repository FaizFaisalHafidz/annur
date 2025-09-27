import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, BookOpen, Target, TrendingUp, User } from 'lucide-react';

interface AlternatifJurusan {
    major: string;
    probability: number;
}

interface PrediksiData {
    id: number;
    siswa_lengkap_id: number;
    jurusan_prediksi: string;
    kategori_jurusan_prediksi: string;
    confidence_score: string;
    alternatif_jurusan: AlternatifJurusan[];
    nilai_mata_pelajaran: Record<string, number>;
    mata_pelajaran_dikuasai: string[];
    minat_ipa: string;
    minat_ips: string;
    minat_bahasa: string;
    minat_seni: string;
    minat_olahraga: string;
    tanggal_prediksi: string;
    siswa_lengkap: {
        id: number;
        nama_lengkap: string;
        nomor_induk: string;
        kelas: string;
        jenis_kelamin: string;
    };
}

interface PageProps {
    prediksi: PrediksiData;
    analysis_detail?: {
        overall_average: number;
        science_average: number;
        social_average: number;
        academic_strength: string;
    };
    input_data?: any;
}

export default function Show({ prediksi, analysis_detail, input_data }: PageProps) {
    const confidencePercentage = Math.round(parseFloat(prediksi.confidence_score) * 100);
    
    // Warna berdasarkan confidence score
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 70) return 'bg-green-100 text-green-800 border-green-200';
        if (confidence >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    // Format mata pelajaran
    const formatMataPelajaran = (key: string) => {
        const mapping: Record<string, string> = {
            'matematika': 'Matematika',
            'bahasa_indonesia': 'Bahasa Indonesia',
            'bahasa_inggris': 'Bahasa Inggris',
            'fisika': 'Fisika',
            'kimia': 'Kimia',
            'biologi': 'Biologi',
            'sejarah': 'Sejarah',
            'geografi': 'Geografi',
            'ekonomi': 'Ekonomi',
            'sosiologi': 'Sosiologi',
            'pkn': 'PKN',
            'seni_budaya': 'Seni Budaya',
            'prakarya': 'Prakarya',
            'pjok': 'PJOK'
        };
        return mapping[key] || key;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Prediksi KNN', href: '/prediksi-knn' },
                { title: 'Hasil Prediksi', href: '' }
            ]}
        >
            <Head title={`Hasil Prediksi - ${prediksi.siswa_lengkap.nama_lengkap}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/prediksi-knn"
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Kembali
                            </Link>
                            <div>
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Hasil Prediksi Jurusan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {prediksi.siswa_lengkap.nama_lengkap}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Informasi Siswa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Informasi Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                                    <p className="font-semibold">{prediksi.siswa_lengkap.nama_lengkap}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nomor Induk</label>
                                    <p className="font-semibold">{prediksi.siswa_lengkap.nomor_induk}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Kelas</label>
                                    <p className="font-semibold">{prediksi.siswa_lengkap.kelas}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tanggal Prediksi</label>
                                    <p className="font-semibold">
                                        {new Date(prediksi.tanggal_prediksi).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hasil Prediksi Utama */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Hasil Prediksi
                            </CardTitle>
                            <CardDescription>
                                Jurusan yang direkomendasikan berdasarkan analisis K-NN
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {prediksi.jurusan_prediksi}
                                    </h3>
                                    <Badge variant="secondary" className="mb-4">
                                        {prediksi.kategori_jurusan_prediksi}
                                    </Badge>
                                    
                                    <div className="flex items-center justify-center space-x-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Tingkat Keyakinan:</span>
                                        <Badge className={getConfidenceColor(confidencePercentage)}>
                                            {confidencePercentage}%
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alternatif Jurusan */}
                    {prediksi.alternatif_jurusan && prediksi.alternatif_jurusan.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Award className="w-5 h-5 mr-2" />
                                    Alternatif Jurusan
                                </CardTitle>
                                <CardDescription>
                                    Rekomendasi jurusan lain berdasarkan probabilitas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {prediksi.alternatif_jurusan
                                        .sort((a, b) => b.probability - a.probability)
                                        .slice(0, 5)
                                        .map((alt, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{alt.major}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{width: `${alt.probability}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600 w-12">
                                                    {alt.probability.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Nilai Akademik */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Nilai Akademik
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(prediksi.nilai_mata_pelajaran).map(([mapel, nilai]) => (
                                        <div key={mapel} className="flex items-center justify-between">
                                            <span className="text-sm">{formatMataPelajaran(mapel)}</span>
                                            <div className="flex items-center space-x-2">
                                                <Badge 
                                                    variant={nilai >= 80 ? 'default' : nilai >= 70 ? 'secondary' : 'outline'}
                                                    className={
                                                        nilai >= 80 ? 'bg-green-100 text-green-800' :
                                                        nilai >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }
                                                >
                                                    {nilai}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mata Pelajaran yang Dikuasai */}
                                {prediksi.mata_pelajaran_dikuasai.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                                            Mata Pelajaran yang Dikuasai (≥80):
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {prediksi.mata_pelajaran_dikuasai.map((mapel, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {formatMataPelajaran(mapel)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Minat & Bakat */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Minat & Bakat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { label: 'IPA', value: parseFloat(prediksi.minat_ipa), key: 'ipa' },
                                        { label: 'IPS', value: parseFloat(prediksi.minat_ips), key: 'ips' },
                                        { label: 'Bahasa', value: parseFloat(prediksi.minat_bahasa), key: 'bahasa' },
                                        { label: 'Seni', value: parseFloat(prediksi.minat_seni), key: 'seni' },
                                        { label: 'Olahraga', value: parseFloat(prediksi.minat_olahraga), key: 'olahraga' }
                                    ].map((minat) => (
                                        <div key={minat.key} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{minat.label}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{width: `${(minat.value / 5) * 100}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-sm w-8">{minat.value.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Analisis Akademik */}
                                {analysis_detail && (
                                    <div className="mt-6 pt-4 border-t">
                                        <h4 className="font-medium text-sm text-gray-700 mb-3">Analisis Akademik:</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Rata-rata Keseluruhan:</span>
                                                <span className="font-medium">{analysis_detail.overall_average?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rata-rata IPA:</span>
                                                <span className="font-medium">{analysis_detail.science_average?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rata-rata IPS:</span>
                                                <span className="font-medium">{analysis_detail.social_average?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Kekuatan Akademik:</span>
                                                <Badge variant="secondary">{analysis_detail.academic_strength}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <Button variant="outline" asChild>
                            <Link href="/prediksi-knn">
                                Prediksi Lain
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/laporan/prediksi">
                                Lihat Semua Prediksi
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}