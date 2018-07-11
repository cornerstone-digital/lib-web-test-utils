import { PNG } from 'pngjs';
export declare const fillSizeDifference: (width: number, height: number) => (image: PNG) => PNG;
export declare const createImageResizer: (width: number, height: number) => (source: PNG) => PNG;
export declare const alignImagesToSameSize: (firstImage: PNG, secondImage: PNG) => PNG[];
export declare const diffImages: (baseImage: PNG, compareImage: PNG) => void;
