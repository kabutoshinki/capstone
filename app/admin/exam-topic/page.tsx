'use client';

import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useCustomModal } from '@/hooks';
import {
    Button,
    Chip,
    ChipProps,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Selection,
    SortDescriptor,
    User
} from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { discussionApi, examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { TopicType } from '@/types';
import HTMLReactParser from 'html-react-parser';
import { Spin } from 'antd';
interface ExamTopicListProps {}

const columns = [
    { name: 'TIÊU ĐỀ', uid: 'name', sortable: true },
    { name: 'Môn Học', uid: 'subject', sortable: true },
    { name: 'Trạng Thái', uid: 'status', sortable: true },
    { name: 'THAO TÁC', uid: 'action' }
];

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};
function getSubjectName(subjectCode: string) {
    switch (subjectCode) {
        case 'MATHEMATICS':
            return 'Toán học';
        case 'ENGLISH':
            return 'Tiếng anh';
        case 'PHYSICS':
            return 'Vật lí';
        case 'CHEMISTRY':
            return 'Hóa học';
        case 'BIOLOGY':
            return 'Sinh học';
        case 'HISTORY':
            return 'Lịch sử';
        case 'GEOGRAPHY':
            return 'Địa lý';
        default:
            return null;
    }
}
const ExamTopicList: React.FC<ExamTopicListProps> = ({}) => {
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(['name', 'subject', 'status', 'action']));
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const {
        status,
        error,
        data: topicsData,
        isPreviousData
    } = useQuery({
        queryKey: ['exam-topics', { page, rowsPerPage, updateState }],
        queryFn: () => examApi.getAllTopicAdmin(page - 1, rowsPerPage)
    });
    console.log(topicsData);

    useEffect(() => {
        if (topicsData?.data) {
            setTopics(topicsData.data);
            setTotalPage(topicsData.totalPage);
            setTotalRow(topicsData.totalRow);
        }
    }, [topicsData]);

    const handleStatusChange = async (id: number) => {
        try {
            onLoading();
            const res = await examApi.deleteTopicExam(id);
            if (!res.data.code) {
                onSuccess({
                    title: 'Đã xóa chủ đề thành công',
                    content: 'Khóa học đã được duyệt thành công'
                });
                setUpdateState(prev => !prev);
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };
    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận xóa',
            content: 'Chủ đề sẽ không được hiển thị sau khi đã từ xóa. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id)
        });
        onOpen();
    };
    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const renderCell = useCallback((post: any, columnKey: Key) => {
        const cellValue = post[columnKey as keyof any];

        switch (columnKey) {
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[post.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE' ? 'Hoạt động' : cellValue === 'DELETED' ? 'Đã xóa' : 'Vô Hiệu'}
                    </Chip>
                );
            case 'action':
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Options" disabledKeys={['editDis', 'delDis']}>
                                <DropdownItem
                                    color="warning"
                                    key={post.status === 'DELETED' ? 'editDis' : 'edit'}
                                    as={Link}
                                    href={`/admin/exam-topic/edit/${post.id}`}
                                >
                                    Chỉnh sửa
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={post.status === 'DELETED' ? 'delDis' : 'delete'}
                                    onClick={() => onDeclineOpen(post?.id)}
                                >
                                    Xóa chủ đề
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'subject':
                return getSubjectName(cellValue);
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chủ đề thi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1"
                            placeholder="Tìm kiếm..."
                            startContent={<BsSearch className="text-default-300" />}
                            value={filterValue}
                            variant="bordered"
                            onClear={() => setFilterValue('')}
                            onValueChange={onSearchChange}
                        />
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        Cột
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={visibleColumns}
                                    selectionMode="multiple"
                                    onSelectionChange={setVisibleColumns}
                                >
                                    {columns.map(column => (
                                        <DropdownItem key={column.uid} className="capitalize">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sm:flex justify-between items-center">
                        <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</span>
                        <label className="flex items-center text-default-400 text-xs sm:text-sm">
                            Số kết quả mỗi trang:
                            <select
                                className="bg-transparent outline-none text-default-400 text-xs sm:text-sm"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </label>
                    </div>
                </div>
                <TableContent
                    renderCell={renderCell}
                    headerColumns={headerColumns}
                    items={topics || []}
                    page={page}
                    setPage={setPage}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                    totalPage={totalPage || 1}
                />
            </Spin>
        </div>
    );
};

export default ExamTopicList;
