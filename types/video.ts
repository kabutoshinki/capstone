export type VideoCardType = {
    id: number;
    thumbnail: string;
    name: string;
    duration: number;
    like: number;
    createDate: string;
    status: string;
    videoStatus: 'PUBLIC' | 'PRIVATE';
    isAccess: boolean;
};

export type ChangeVideoStatus = {
    id: number;
    verifyStatus: string;
};
