import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'About Us', //title ontop of page
        href: '/aboutUs', //link to page
    },
];

export default function AboutUs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="aboutUs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <div className="flex h-40 items-center justify-center">
                        <h1 className="pt-8 text-5xl">About Us</h1>
                    </div>
                    <div className="space-y-9 p-20 text-2xl">
                        <p>
                            We know how difficult it can be for studends to juggle school, assignments and deadlines. Hey there! We’re{' '}
                            <strong>WorkWise</strong> and we know how challenging it can be to juggle school, assignments, deadlines, and everything
                            else life throws at you. That’s why we built this task manager specifically for students like you. We wanted to create a
                            simple, no-fuss tool to help you stay on top of your tasks, track your progress, and feel more in control of your time.
                            Whether you’re working on assignments, preparing for exams, or just trying to keep your life organized, we’ve got your
                            back. Our goal is to help make student life a little less stressful and a lot more productive. So, go ahead and start
                            managing your tasks with ease because you’ve got enough on your plate already.
                        </p>
                        <p>
                            At <strong>WorkWise</strong>, we believe that staying organized doesn’t have to be complicated. That’s why our platform is
                            designed to be intuitive and user-friendly, giving you the freedom to focus on what really matters: your studies and
                            personal growth. We’ve combined powerful features with a clean design so you don’t have to waste time figuring out how to
                            use the tool, just get in, get organized, and get going. We’re committed to continuously improving{' '}
                            <strong>WorkWise</strong> based on your feedback. Whether it’s adding new features, refining the design, or helping you
                            manage your tasks in even better ways, we’re always working to make your experience as seamless as possible. Together, we
                            can make your academic journey smoother and more efficient, so you can focus on achieving your goals and enjoying life
                            outside the classroom.
                        </p>
                        <p>
                            Welcome to <strong>WorkWise</strong>. Let’s make student life easier, together!
                        </p>
                    </div>
                    <div className="p-20">
                        <h2 className="text-3xl">Contact:</h2>
                        <p className="text-xl">WorkWise@email.com</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
