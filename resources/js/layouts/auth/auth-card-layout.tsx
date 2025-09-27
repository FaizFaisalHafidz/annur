import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-green-800/10 via-emerald-800/10 to-green-900/15 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-3 self-center font-medium group">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-green-800/20 group-hover:ring-green-800/40 transition-all duration-300">
                        <img 
                            src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-ma.png" 
                            alt="Logo Mathla'ul Anwar" 
                            className="h-10 w-10 object-contain"
                        />
                    </div>
                    <div className="text-green-900 font-semibold text-lg">SMA Mathla'ul Anwar</div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border-green-800/20 shadow-xl bg-white/90 backdrop-blur-sm">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl text-green-900">{title}</CardTitle>
                            <CardDescription className="text-green-800/70">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
