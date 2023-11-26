import StudentLayout from '@/components/header/StudentLayout';
import React from 'react';

export const metadata = {
    title: 'CEPA - Hồ sơ',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const Layout = ({ children }: { children: React.ReactNode }) => <StudentLayout>{children}</StudentLayout>;

export default Layout;
