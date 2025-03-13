import { ImgHTMLAttributes } from 'react';

export default function AppLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <img {...props} src="images/logo.png" alt="App Logo" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">WorkWise</span>
            </div>
        </>
    );
}
