import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} src="images/logo.png" alt="App Logo" className="h-30 w-30" />;
}
