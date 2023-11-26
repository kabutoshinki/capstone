'use client';

import { discussionApi } from '@/api-client';
import Loader from '@/components/Loader';
import PostTitle from '@/components/discussion/PostTitle';
import { InputFormula } from '@/components/form-input/InputFormula';
import { ReportModal } from '@/components/modal';
import CommentItem from '@/components/video/CommentItem';
import { useReportModal, useUser } from '@/hooks';
import { CommentCardType } from '@/types/comment';
import { Button, Card, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { BsArrowLeft } from 'react-icons/bs';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';

interface PostDetailProps {
    params: { id: number };
}

const PostDetail: React.FC<PostDetailProps> = ({ params }) => {
    const router = useRouter();
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [reportCommentId, setReportCommentId] = useState<number | null>(null);
    const { data: discussionData } = useQuery({
        queryKey: ['discussionDetail'],
        queryFn: () => discussionApi.getDiscussionById(params?.id)
    });

    const { data: commentsData } = useQuery({
        queryKey: ['commentsByDiscussion', updateState],
        queryFn: () => discussionApi.getCommentsByDiscussionId(params?.id)
    });

    const currentUser = useUser();
    const { control, handleSubmit, setError, reset } = useForm({
        defaultValues: {
            title: '',
            course: '',
            description: '',
            response: ''
        }
    });

    const {
        onOpen,
        onClose,
        onContentType,
        reportType,
        description,
        contentType,
        onReportType,
        onDescription,
        onFile,
        file
    } = useReportModal();

    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    const onSubmit = async (formData: any) => {
        try {
            const formDataWithImage = new FormData();
            formDataWithImage.append('content', formData.response);
            formDataWithImage.append('commentParentId', '-1');
            if (uploadedFiles.length > 0) {
                formDataWithImage.append('image', uploadedFiles[0]); // assuming 'image' is the field name expected by the server
            }
            const response = await discussionApi.createComment(formDataWithImage, discussionData?.id);
            if (response) {
                reset();
                setUploadedFiles([]);
                setUpdateState(prev => !prev);
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const onSubmitReport = async () => {
        try {
            const formDataWithImage = new FormData();
            formDataWithImage.append('reportMsg', description);
            formDataWithImage.append('reportType', reportType.toUpperCase());
            if (file) {
                formDataWithImage.append('image', file); // assuming 'image' is the field name expected by the server
            }
            if (contentType == 'discussion') {
                const response = await discussionApi.createConversationReport(formDataWithImage, discussionData?.id);

                if (response) {
                    onDescription('');
                    onReportType('integrity');
                    onFile(null);
                    onClose();
                }
            } else if (contentType == 'comment') {
                if (reportCommentId) {
                    const response = await discussionApi.createCommentReport(formDataWithImage, reportCommentId);
                    if (response) {
                        onDescription('');
                        onReportType('integrity');
                        onFile(null);
                        onClose();
                    }
                }
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const openReportModal = () => {
        onContentType('discussion');
        onOpen();
    };
    const postContent = {
        id: discussionData?.id,
        title: discussionData?.title,
        content: discussionData?.content,
        imageUrl: discussionData?.imageUrl,
        owner: discussionData?.owner,
        auth: discussionData?.ownerFullName,
        like: discussionData?.reactCount,
        avatar: discussionData?.ownerAvatar,
        createTime: discussionData?.createTime
    };
    const commonInfo = {
        id: 1,
        ownerFullName: 'Nguyễn Văn A',
        content: 'Nội dung rất hay'
    };
    if (!discussionData) return <Loader />;
    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <div className="flex justify-between items-center mt-2">
                <div onClick={() => router.back()} className="flex items-center gap-2 text-sm cursor-pointer">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </div>
                {currentUser.user && currentUser?.user?.fullName !== discussionData?.ownerFullName && (
                    <Button size="sm" color="danger" onClick={openReportModal}>
                        Báo cáo
                    </Button>
                )}
            </div>

            <PostTitle postContent={postContent} from="student" />
            {currentUser?.user?.fullName !== discussionData?.ownerFullName && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4 items-center">
                        <div className="h-[100px] w-[160px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} name="avatar" />
                                {uploadedFiles.length ? (
                                    <div className="group relative">
                                        <Image
                                            className="object-cover w-full h-[100px]"
                                            key={uploadedFiles[0].path}
                                            src={URL.createObjectURL(uploadedFiles[0])}
                                            alt={uploadedFiles[0].path as string}
                                            width={160}
                                            height={100}
                                        />
                                        <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                            <RiImageEditLine size={28} />
                                            <span className="text-sm">Cập nhật ảnh</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center">
                                        <RiImageAddLine size={28} />
                                        <span className="text-sm">Thêm ảnh</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-[1]">
                            <InputFormula name="response" placeholder="Viết suy nghĩ của bạn" control={control} />
                        </div>
                        <Button className="mt-8" type="submit" color="primary">
                            Gửi
                        </Button>
                    </div>
                </form>
            )}

            <div className="w-full mt-12">
                <Select
                    size="sm"
                    label="Sắp xếp theo"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['0']}
                    className="w-[240px] mt-4"
                >
                    <SelectItem key={0} value={0}>
                        Thời gian
                    </SelectItem>
                    <SelectItem key={1} value={1}>
                        Tương tác
                    </SelectItem>
                </Select>
                <Card className="mt-8 p-8">
                    <ul>
                        {commentsData?.data?.length ? (
                            commentsData?.data?.map((commentInfo: CommentCardType) => (
                                <CommentItem
                                    key={commentInfo?.id}
                                    commentInfo={commentInfo}
                                    onCommentId={setReportCommentId}
                                />
                            ))
                        ) : (
                            <>
                                <CommentItem commentInfo={commonInfo} />
                            </>
                        )}
                        {/* <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem /> */}
                    </ul>
                    {/* <Button className="w-full">Xem thêm</Button> */}
                </Card>
            </div>
            <ReportModal onReport={onSubmitReport} />
        </div>
    );
};

export default PostDetail;
