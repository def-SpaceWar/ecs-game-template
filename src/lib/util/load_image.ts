export function loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (e: any) => {
            reject(e);
        };
    });
};
