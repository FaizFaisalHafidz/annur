import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Brain, FileText, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

interface CustomProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            email_verified_at: string | null;
            created_at: string;
            updated_at: string;
            roles: { name: string }[]; // Array of roles with name property
        };
    };
    [key: string]: any; // Index signature untuk PageProps compatibility
}

export function AppSidebar() {
    const { auth } = usePage<CustomProps>().props;
    const roles = auth.user?.roles?.map(role => role.name) || [];

    // Menu dasar untuk semua pengguna
    const dashboardMenu: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];
    
    // Menu untuk Super Admin (semua fitur)
    const superAdminMenu: NavItem[] = [
        {
            title: 'Data Siswa',
            href: '/siswa',
            icon: Users,
        },
        {
            title: 'Prediksi KNN',
            href: '/prediksi',
            icon: Brain,
        },
        {
            title: 'Laporan',
            href: '/laporan',
            icon: FileText,
        },
        // {
        //     title: 'Pengaturan',
        //     href: '/pengaturan',
        //     icon: Settings,
        // },
    ];
    
    // Menu untuk Guru BK/TU (hanya Prediksi dan Laporan)
    const guruBKMenu: NavItem[] = [
        {
            title: 'Prediksi KNN',
            href: '/prediksi',
            icon: Brain,
        },
        {
            title: 'Laporan',
            href: '/laporan',
            icon: FileText,
        },
    ];
    
    // Menentukan menu yang akan ditampilkan berdasarkan role
    let mainNavItems = [...dashboardMenu];
    
    if (roles.includes('Super Admin')) {
        mainNavItems = [...mainNavItems, ...superAdminMenu];
    } else if (roles.includes('Guru BK')) {
        mainNavItems = [...mainNavItems, ...guruBKMenu];
    }

    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Repository',
        //     href: 'https://github.com/laravel/react-starter-kit',
        //     icon: Folder,
        // },
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
