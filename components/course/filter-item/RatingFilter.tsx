'use client';

import { AccordionItem, Radio, RadioGroup } from '@nextui-org/react';
import { Rate } from 'antd';
import { AiFillStar } from 'react-icons/ai';

interface RatingFilterProps {}

const RatingFilter: React.FC<RatingFilterProps> = () => {
    return (
        <RadioGroup size="sm" color="secondary" defaultValue="london" className="mb-4">
            <Radio value="4.5" className="flex items-center">
                <Rate allowHalf disabled defaultValue={4.5} className="!text-yellow-500 !text-xs !mb-2 !mx-2" />
                <span className="text-sm">Từ 4.5 trở lên</span>
            </Radio>
            <Radio value="4" className="flex items-center">
                <Rate allowHalf disabled defaultValue={4} className="!text-yellow-500 !text-xs !mb-2 !mx-2" />
                <span className="text-sm">Từ 4 trở lên</span>
            </Radio>
            <Radio value="3.5">
                <Rate allowHalf disabled defaultValue={3.5} className="!text-yellow-500 !text-xs !mb-2 !mx-2" />
                <span className="text-sm">Từ 3.5 trở lên</span>
            </Radio>
            <Radio value="3" className="flex items-center">
                <Rate allowHalf disabled defaultValue={3} className="!text-yellow-500 !text-xs !mb-2 !mx-2" />
                <span className="text-sm">Từ 3 trở lên</span>
            </Radio>
        </RadioGroup>
    );
};

export default RatingFilter;
