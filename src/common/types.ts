interface ThumbnailProps {
    thumbnails: {
        time: number;
        url: string;
    }[];
    onClick: (time: number) => void
}

interface RegionProps {
    id: string;
    start: number;
    end: number;
    totalDuration?: number;


    channelIdx?: number;
    color?: string;
    content?: undefined
    contentEditable?: boolean
    drag?: boolean
    maxLength?: number;
    minLength?: number;
    numberOfChannels?: number;
    resize?: boolean;
    resizeEnd?: boolean;
    resizeStart?: boolean;
    subscriptions?: () => void[]
}
interface videoProps{
    videoUrl:string
}
interface WaveProps{
    videoUrl:string;
    videoRef: React.RefObject<HTMLVideoElement | null>
}
interface RangeProps{
    percent:number;
    value:number;
     handleSeek:(e: React.ChangeEvent<HTMLInputElement>) => void;
     min:number;
     max:number;
}

export type { ThumbnailProps, RegionProps,videoProps,WaveProps,RangeProps }