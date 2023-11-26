'use client';

import { Carousel } from 'antd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { vertical } from '@/animations';

interface SliderProps {}

const Slider: React.FC<SliderProps> = () => {
    return (
        <motion.div
            {...vertical(-100, 0.5, 0)}
            className="mt-10 sm:mt-0 w-full sm:w-6/12 lg:w-7/12 flex items-center justify-center"
        >
            <Carousel autoplay className="w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px]">
                <div>
                    <div className="h-[200px] sm:h-[240px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image src="/banner/slide-1.png" alt="" width={1000} height={562} className="object-cover" />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[240px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image src="/banner/slide-5.png" alt="" width={1000} height={562} />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[240px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image src="/banner/slide-4.png" alt="" width={951} height={466} />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[240px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image src="/banner/slide-2.png" alt="" width={951} height={466} />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[240px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[336px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image src="/banner/slide-3.png" alt="" width={951} height={466} />
                    </div>
                </div>
            </Carousel>
        </motion.div>
    );
};

export default Slider;
