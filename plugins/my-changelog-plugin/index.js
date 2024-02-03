const fs = require('fs');
const path = require('path');
const glob = require('glob'); // 你可能需要安装glob库

module.exports = function (context, options) {
    return {
        name: 'my-changelog-plugin',
        async loadContent() {
            // 用于存储changelog信息的数组
            const changelogs = [];

            // 获取所有Markdown文件
            const files = glob.sync('src/md/changelog/**/*.md');

            // 读取每个文件的内容
            files.forEach(file => {
                const content = fs.readFileSync(file, 'utf-8');
                const filename = path.basename(file);

                const [version, language] = filename.split('_'); // 假设文件名格式为 "版本号_语言.md"

                // 解析内容
                const sections = content.split('## ').slice(1); // 以 "## "分割，去掉第一个空元素
                const changes = sections.map(section => {
                    const [type, ...items] = section.split('\n').filter(Boolean); // 分割并去除空行
                    return items.map(item => ({
                        type: type.trim(), // "新增", "优化", "修复"等
                        content: item.slice(2).trim() // 移除列表项标记
                    }));
                }).flat(); // 将数组扁平化

                changelogs.push({ version, language, changes });
            });

            // 返回changelogs数组，以便在其他插件方法中使用
            return changelogs;
        },
        async contentLoaded({ content, actions }) {
            const { createData } = actions;
            // 将changelogs数组保存到`.docusaurus`目录下的一个JSON文件中
            await createData('changelogs.json', JSON.stringify(content, null, 2));
        },
    };
};
