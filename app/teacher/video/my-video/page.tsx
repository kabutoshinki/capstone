'use client';

import React, { useEffect, useState } from 'react';

import VideoCard from '@/components/video/VideoCard';
import { courseApi, videoApi } from '@/api-client';
import { useUser } from '@/hooks';
import { Course, VideoCardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    SelectItem
} from '@nextui-org/react';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
interface MyVideoProps {}

const MyVideo: React.FC<MyVideoProps> = ({}) => {
    const [videos, setVideos] = useState<VideoCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [selectedCourse, setSelectedCourse] = useState<number>(0);
    const [page, setPage] = useState(1);
    const currentUser = useUser();
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: selectedCourse == 0 ? ['videoList', page, selectedCourse] : ['videoListCourse', page, selectedCourse],
        // keepPreviousData: true,
        queryFn: () => {
            if (selectedCourse != 0) {
                return videoApi.getByCourseId(selectedCourse, page - 1, 20, 'id', 'ASC');
            } else {
                return videoApi.getAllOfTeacher('ALL', page - 1, 20, 'id', 'ASC');
            }
        }
    });

    const { data: coursesData, isLoading } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher(0, 100)
    });

    useEffect(() => {
        if (data?.data) {
            setVideos(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data]);

    const statusArr = [
        {
            value: 'AVAILABLE',
            name: 'Hoạt động'
        },
        {
            value: 'REJECT',
            name: 'Đã từ chối'
        },
        {
            value: 'BANNED',
            name: 'Đã cấm'
        },
        {
            value: 'WAITING',
            name: 'Chờ phê duyệt'
        },
        {
            value: 'UPDATING',
            name: 'Chờ cập nhật'
        },
        {
            value: 'UNAVAILABLE',
            name: 'Vô hiệu'
        }
    ];

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    console.log(videos);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video của tôi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="mt-8 flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[50%] border-1"
                        placeholder="Tìm kiếm..."
                        size="sm"
                        color="primary"
                        startContent={<BsSearch className="text-default-300" />}
                        // value={filterValue}
                        variant="bordered"
                        onClear={() => {}}
                        // onValueChange={onSearchChange}
                    />

                    <Select
                        size="sm"
                        labelPlacement="outside"
                        label="Khóa học"
                        color="primary"
                        variant="bordered"
                        onChange={event => setSelectedCourse(Number(event.target.value))}
                    >
                        {coursesData?.data?.map((course: Course) => (
                            <SelectItem key={course?.id} value={course?.id}>
                                {course?.courseName}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="flex">
                                <Button
                                    endContent={<BsChevronDown className="text-small" />}
                                    size="sm"
                                    color="primary"
                                    variant="bordered"
                                >
                                    Trạng thái
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                // selectedKeys={() => {}}
                                selectionMode="single"
                                onSelectionChange={() => {}}
                            >
                                {statusArr.map(statusItem => (
                                    <DropdownItem key={statusItem.value} className="capitalize">
                                        {capitalize(statusItem.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}
                </div>
                {totalRow ? (
                    <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</p>
                ) : null}
                <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {videos.length ? (
                        videos.map((videoItem: VideoCardType) => (
                            <VideoCard type="teacher" key={videoItem?.id} video={videoItem} />
                        ))
                    ) : (
                        <>Danh Sách Video Trống</>
                    )}
                </div>
                {totalPage && totalPage > 1 ? (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                ) : null}
            </Spin>
        </div>
    );
};

export default MyVideo;
