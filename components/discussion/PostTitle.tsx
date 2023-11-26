'use client';

import { Button, User } from '@nextui-org/react';
import Image from 'next/image';
import { AiOutlineLike } from 'react-icons/ai';
import { BiSolidPencil } from 'react-icons/bi';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { discussionApi } from '@/api-client';

interface PostTitleProps {
    postContent: {
        id: number;
        title: string;
        content: string;
        imageUrl?: string;
        owner?: boolean;
        auth: string;
        like: number;
        avatar: string;
        createTime: string;
    };
    from: 'student' | 'teacher' | 'admin';
}
const calculateTimeDifference = (postTime: any) => {
    const currentTime = new Date().getTime();
    const postDateTime = new Date(postTime).getTime();
    const timeDifference = currentTime - postDateTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} ngày trước`;
    } else if (hours > 0) {
        return `${hours} giờ trước`;
    } else if (minutes > 0) {
        return `${minutes} phút trước`;
    } else {
        return 'Vừa xong';
    }
};

const PostTitle: React.FC<PostTitleProps> = ({ postContent, from }) => {
    const handleLikeClick = async () => {
        try {
            // Assuming postContent.id is the discussionId
            const response = await discussionApi.discussionReact(postContent?.id);
            // Handle the response as needed
            console.log('API response:', response);
        } catch (error) {
            // Handle errors
            console.error('Error reacting to discussion:', error);
        }
    };
    return (
        <div className={`my-8 grid sm:grid-cols-10 rounded-xl ${postContent.title ? 'bg-blue-50' : ''}`}>
            <div className="hidden sm:block p-4 border-1 border-l-blue-500 border-t-blue-500 border-b-blue-500 col-span-2 rounded-s-xl">
                <User
                    name={postContent?.auth || 'Jane Doe'}
                    description={calculateTimeDifference(postContent?.createTime) || '2 giờ trước'}
                    avatarProps={{
                        src: `${
                            postContent.avatar ? postContent?.avatar : 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                        }`
                    }}
                />
            </div>
            <div className="p-4 border-1 border-blue-500 col-span-8 relative rounded-r-xl rounded-l-xl sm:rounded-l-none">
                <User
                    name={'Jane Doe'}
                    description="2 giờ trước"
                    avatarProps={{
                        src: `${
                            postContent.avatar ? postContent?.avatar : 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                        }`
                    }}
                    className="sm:hidden"
                />
                <div>
                    <h4 className="font-semibold text-base mb-2">{postContent?.title}</h4>
                    <div className="my-2">
                        <Gallery>
                            <Item
                                original={(postContent?.imageUrl as string) || '/banner/slide-1.png'}
                                width="1024"
                                height="768"
                            >
                                {({ open }) => (
                                    <Image
                                        onClick={open}
                                        src={(postContent?.imageUrl as string) || '/banner/slide-1.png'}
                                        width={100}
                                        height={80}
                                        alt=""
                                    />
                                )}
                            </Item>
                        </Gallery>
                    </div>
                    <span className="text-xs sm:text-sm">{HTMLReactParser(String(postContent?.content))}</span>
                </div>
                <div className="absolute flex items-center gap-2 bottom-2 right-4">
                    {postContent?.owner ? (
                        <>
                            <Button
                                as={Link}
                                href={`${
                                    from === 'student'
                                        ? '/discussion/edit/' + postContent?.id
                                        : '/teacher/discussion/edit/' + postContent?.id
                                }`}
                                size="sm"
                                variant="light"
                                className="text-yellow-500"
                            >
                                <span className="text-sm">Chỉnh sửa</span>
                                <BiSolidPencil className="cursor-pointer " />
                            </Button>
                        </>
                    ) : (
                        <>
                            <AiOutlineLike className="cursor-pointer text-blue-500" onClick={handleLikeClick} />
                        </>
                    )}

                    <span className="text-sm text-blue-500">{postContent?.like}</span>
                </div>
            </div>
        </div>
    );
};

export default PostTitle;
