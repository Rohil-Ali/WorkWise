import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex w-full flex-col items-center justify-center text-center lg:grow">
                    {/* Logo */}
                    <div className="mb-6">
                        <AppLogoIcon />
                    </div>
                    <h1 className="mb-4 text-5xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Welcome to WorkWise</h1>
                    <p className="mb-8 text-lg text-[#3E3E3A] dark:text-[#A3A3A3]">
                        Your ultimate productivity companion. Manage tasks, track time, and stay organised effortlessly.
                    </p>
                    <div className="flex gap-4">
                        <Link href={route('register')} className="rounded-full bg-purple-500 px-6 py-3 text-white shadow-lg hover:bg-purple-600">
                            Get Started
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-full border border-purple-500 px-6 py-3 text-purple-500 shadow-lg hover:bg-purple-500 hover:text-white"
                        >
                            Log In
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <h2 className="mb-4 text-3xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Why Choose WorkWise?</h2>
                    <p className="text-md mx-auto max-w-2xl text-[#3E3E3A] dark:text-[#A3A3A3]">
                        WorkWise is designed to help you stay productive and organised. Whether your're workig on an assignment or revising for your
                        next test, WorkWise has the tools you need to succeed.
                    </p>
                </div>

                <footer className="mt-12 text-sm text-[#3E3E3A] dark:text-[#A3A3A3]">2025 WorkWise.</footer>
            </div>
        </>
    );
}
