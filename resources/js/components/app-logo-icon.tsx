import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/images/new-logo.png" alt="Logo" {...props} />
    );
}
