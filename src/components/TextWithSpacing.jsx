import React from 'react';

const TextWithSpacing = ({ children }) => {
    // 使用正则表达式匹配中文字符和英文数字，将它们分割成数组
    const segments = children.split(/([\u4e00-\u9fa5]+)/).filter(Boolean);

    return (
        <>
            {segments.map((segment, index) => {
                const lang = /[\u4e00-\u9fa5]/.test(segment) ? 'zh' : 'en';
                return <span key={index} lang={lang} className={`text-segment`}>{segment}</span>;
            })}
        </>
    );
};

export default TextWithSpacing;
