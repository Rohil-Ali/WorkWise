import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Logo positioned at the top left, hidden on small screens */}
            <div className="absolute top-0 left-0 m-4 hidden lg:flex">
                <Link href={route('home')} className="flex items-center">
                    <AppLogoIcon className="h-12 w-12 sm:h-16 sm:w-16" />
                </Link>
            </div>

            {/* This is the left side of the split layout */}
            <div className="flex w-full items-center justify-center lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Logo displayed above the login form on small screens */}
                    <div className="flex justify-center lg:hidden">
                        <Link href={route('home')} className="flex items-center">
                            <AppLogoIcon className="h-12 w-12 sm:h-16 sm:w-16" />
                        </Link>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* This is the right side of the split layout */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700" />
                <div className="relative z-20 flex h-full flex-col items-center justify-center space-y-8">
                    <h1 className="text-5xl font-bold">Work Wise</h1>
                    <p className="text-2xl font-medium">These famous people use task managers, why don't you?</p>
                    {quote && (
                        <blockquote className="space-y-4 text-center">
                            <p className="text-4xl font-semibold">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-2xl text-gray-300">{quote.author}</footer>
                        </blockquote>
                    )}
                </div>
            </div>
        </div>
    );
}
