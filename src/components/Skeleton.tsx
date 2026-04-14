import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    variant = 'rounded'
}) => {
    const baseClasses = 'skeleton inline-block';

    const variantClasses = {
        text: 'h-4 w-full mb-2',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-2xl'
    };

    const style: React.CSSProperties = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
