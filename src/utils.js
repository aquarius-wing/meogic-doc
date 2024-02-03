export const processTextForSpacing = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    doc.body.querySelectorAll('*').forEach(node => {
        node.childNodes.forEach(child => {
            if (child.nodeType === 3 && child.nodeValue.trim()) {
                // 使用正则表达式分割文本，连续的中文和全角标点作为一个整体，英文和数字作为另一个整体
                const segments = child.nodeValue.split(/([A-Za-z0-9]+|[\u4e00-\u9fa5，。、！？；：‘’“”（）【】《》]+)/).filter(Boolean);
                const fragment = document.createDocumentFragment();
                segments.forEach(segment => {
                    const span = document.createElement('span');
                    span.className = 'text-segment';
                    span.setAttribute('lang', /[A-Za-z0-9]+/.test(segment) ? 'en' : 'zh');
                    span.textContent = segment;
                    fragment.appendChild(span);
                });
                child.replaceWith(fragment);
            }
        });
    });

    return doc.body.innerHTML;
};
