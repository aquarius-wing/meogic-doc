// src/components/ChangelogComponent.js
import React, { useEffect, useState } from 'react';
import * as marked from 'marked';
import TextWithSpacing from "@site/src/components/TextWithSpacing";
import {processTextForSpacing} from "@site/src/utils";


const ChangelogComponent = () => {
    const [changelogs, setChangelogs] = useState([]);

    useEffect(() => {
        // 动态导入changelogs.json
        import('../../.docusaurus/my-changelog-plugin/default/changelogs.json')
            .then(data => {
                setChangelogs(data.default);
            });
    }, []);

    const changeTypeToStyle = (type) => {
        switch (type) {
            case '新增':
            case 'New':
            case 'New Features':
            case 'Addition':
            case 'Additions':
                return { className: 'pill_added', text: 'new' };
            case '优化':
            case 'Enhancements':
            case 'Optimization':
            case 'Optimize':
            case 'Optimizations':
                return { className: 'pill_improved', text: 'improved' };
            case '修复':
            case 'Fix':
            case 'Fixes':
            case 'Bug Fixes':
                return { className: 'pill_fixed', text: 'fixed' };
            default:
                return { className: '', text: 'unknown' };
        }
    };

    console.log("changelogs", changelogs);

    /*return (
        <ul className={'note_notes'}>
            {changelogs.map((log, index) => (
                log.changes.map((change, changeIndex) => {
                    const { className, text } = changeTypeToStyle(change.type);
                    return (
                        <li key={`${index}-${changeIndex}`}>
                            <span className="note_variant">
                              <span className={`pill ${className}`}>{text}</span>
                            </span>
                            <span className="note_text" dangerouslySetInnerHTML={{ __html: marked.marked(change.content) }} />
                        </li>
                    );
                })
            ))}
        </ul>
    );*/
    return changelogs.filter((log) => log.language === 'zh.md')
        .sort((a, b) => {
            const aVersion = a.version.split('.').map(num => parseInt(num, 10));
            const bVersion = b.version.split('.').map(num => parseInt(num, 10));

            // 比较主版本号、次版本号、修订号
            for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
                if ((aVersion[i] || 0) !== (bVersion[i] || 0)) {
                    return (bVersion[i] || 0) - (aVersion[i] || 0);
                }
            }
            return 0;
        })
        .map((log, index) => (
        <div className="note_section" key={index}>
            <div className="subtitle_subtitle">
                <h2 id={log.version}>
                    <a href={`#${log.version}`} className="anchor-link">🔗</a>
                    {log.version}
                </h2>
                <div><a className="button button_gray" href={`#${log.version}`}><TextWithSpacing>2024年2月1号</TextWithSpacing></a></div>
            </div>
            <ul className="note_notes">
                {log.changes.map((change, changeIndex) => {
                    const { className, text } = changeTypeToStyle(change.type);
                    return (
                        <li key={`${index}-${changeIndex}`}>
              <span className="note_variant">
                <span className={`pill ${className}`}>{text}</span>
              </span>
                            <span className="note_text" dangerouslySetInnerHTML={{ __html: processTextForSpacing(marked.marked(change.content)) }} />
                        </li>
                    );
                })}
            </ul>
        </div>
    ))
};

export default ChangelogComponent;
