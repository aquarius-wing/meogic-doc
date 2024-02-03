// utils/processTextForSpacing.js
export const processTextForSpacing = (htmlString) => {
    // 使用DOM解析器解析HTML字符串
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // 遍历所有文本节点，将文本包装在<span>中，并添加lang属性
    doc.body.querySelectorAll('*').forEach(node => {
        node.childNodes.forEach(child => {
            if (child.nodeType === 3 && child.nodeValue.trim()) { // nodeType 3 是文本节点
                const segments = child.nodeValue.split(/([\u4e00-\u9fa5]+)/).filter(Boolean);
                const fragment = document.createDocumentFragment();
                segments.forEach(segment => {
                    const span = document.createElement('span');
                    span.className = 'text-segment';
                    span.setAttribute('lang', /[\u4e00-\u9fa5]/.test(segment) ? 'zh' : 'en');
                    span.textContent = segment;
                    fragment.appendChild(span);
                });
                child.replaceWith(fragment);
            }
        });
    });

    return doc.body.innerHTML;
};
