'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';
import { FaComments } from 'react-icons/fa';
import { RxVideo } from 'react-icons/rx';

interface VideoItemProps {
    type?: 'my-video' | 'teacher-video' | 'teacher-video-draft' | 'admin-review-video' | 'admin-view-video';
    isMyVideo?: boolean;
    isTeacherVideo?: boolean;
    isAdminReviewCourse?: boolean;
    videoItem: {
        id: number;
        name: string;
        duration: number;
        totalComment: number;
        totalLike: number;
    };
    index: number;
}

const floatToTime = (durationFloat: number): string => {
    if (durationFloat > 100) {
        const hours = Math.floor(durationFloat / 3600);
        const minutes = Math.floor((durationFloat % 3600) / 60);
        const seconds = Math.floor(durationFloat % 60);

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    } else {
        const totalSeconds = Math.round(durationFloat * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
};

const VideoItem: React.FC<VideoItemProps> = ({
    videoItem,
    index,
    isMyVideo,
    isTeacherVideo,
    isAdminReviewCourse,
    type
}) => {
    let detailPage = '';
    if (type == 'teacher-video') detailPage = `/teacher/video/${videoItem?.id}`;
    else if (type == 'teacher-video-draft') detailPage = `/teacher/video/my-video-draft/${videoItem?.id}`;
    else if (type == 'my-video') detailPage = `/my-course/${videoItem?.id}`;
    else if (type == 'admin-review-video') detailPage = `/admin/approve/video/${videoItem?.id}`;
    else if (type == 'admin-view-video') detailPage = `/admin/video/${videoItem?.id}`;
    else detailPage = `/video/${videoItem?.id}`;
    return (
        <li className="relative w-[85%] sm:w-[90%] mx-auto mb-4 py-4 bg-white rounded-xl shadow-lg">
            <Link href={detailPage}>
                <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                    <Image src="/video-number/blue.svg" width={60} height={60} alt="" />
                    <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-sm">
                        {index + 1}
                    </p>
                </div>
                <div className="flex justify-between px-6 sm:px-8">
                    <div className="flex items-center w-4/5">
                        <RxVideo className="text-blue-300 mr-2 text-xl hidden sm:block" />
                        <p className="truncate text-xs sm:text-sm text-black">{videoItem?.name}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-black">{floatToTime(videoItem?.duration)}</p>
                </div>
                <div className="px-8 mt-4 text-xs">
                    <span className="inline-flex items-center">
                        <span className="text-black">{videoItem?.totalLike}</span>
                        <BiSolidLike className="text-sm text-blue-300 ml-2" />
                    </span>
                    <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                        <span className="inline-flex items-center">
                            <span className="text-black">{videoItem?.totalComment}</span>
                            <FaComments className="text-sm text-blue-300 ml-2" />
                        </span>
                    </span>
                </div>
            </Link>
        </li>
    );
};

export default VideoItem;
