// src/components/ChangelogComponent.js
import React, { useEffect, useState } from 'react';
import * as marked from 'marked';
import TextWithSpacing from "@site/src/components/TextWithSpacing";
import {processTextForSpacing} from "@site/src/utils";
import {format, parse} from "date-fns";
import { zhCN, enUS } from 'date-fns/locale';

const ChangelogComponent = () => {

    const [currentLang, setCurrentLang] = useState('');

    useEffect(() => {
        // 读取当前页面的语言设置
        const lang = document.documentElement.lang;
        if (lang === 'zh-CN') {
            setCurrentLang('zh');
        } else if (lang === 'en-US') {
            setCurrentLang('en');
        } else {
            setCurrentLang(lang);
        }
    }, []);

    const [changelogs, setChangelogs] = useState([]);

    useEffect(() => {
        // 动态导入changelogs.json
        import('../../.docusaurus/my-changelog-plugin/default/changelogs.json')
            .then(data => {
                setChangelogs(data.default);
            });
    }, []);

    const i18n = {
        zh: {
            new: '新增',
            improved: '优化',
            fixed: '修复',
        },
        en: {
            new: 'New',
            improved: 'Improved',
            fixed: 'Fixes',
        },
    }

    const versions = {
        '0.5.6': '2024年1月31号',
        '0.5.5': '2024年1月23号',
        '0.5.4': '2024年1月13号',
        '0.5.3': '2024年1月08号',
        '0.5.2': '2024年1月01号',
    }
    const getLocale = (currentLang) => {
        switch (currentLang) {
            case 'zh':
                return zhCN;
            case 'en':
                return enUS;
            default:
                return enUS; // 默认为英文
        }
    };
    // 格式化所有版本的日期
    const formatVersionDate = (version, log) => {
        let dateString = versions[version];
        if (!dateString) {
            const date = new Date(log.createTime);
            dateString = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
            if (!dateString) {
                return '日期未知';
            }
            return dateString
        }
        const date = parse(dateString, 'yyyy年M月dd号', new Date());
        return format(date, 'PPP', { locale: getLocale(currentLang) });
    };

    const changeTypeToStyle = (type) => {
        switch (type) {
            case '新增':
            case 'New':
            case 'New Features':
            case 'Addition':
            case 'Additions':
                return { className: 'pill_added', text: i18n[currentLang].new };
            case '优化':
            case 'Enhancements':
            case 'Optimization':
            case 'Optimize':
            case 'Optimizations':
                return { className: 'pill_improved', text: i18n[currentLang].improved };
            case '修复':
            case 'Fix':
            case 'Fixes':
            case 'Bug Fixes':
                return { className: 'pill_fixed', text: i18n[currentLang].fixed };
            default:
                return { className: '', text: 'unknown' };
        }
    };

    return changelogs.filter((log) => log.language === currentLang)
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
                <div>
                    <a className="button button_gray" href={`#${log.version}`}>
                        <TextWithSpacing>{formatVersionDate(log.version, log)}</TextWithSpacing>
                    </a>
                </div>
            </div>
            <ul className="note_notes">
                {log.changes.map((change, changeIndex) => {
                    const { className, text } = changeTypeToStyle(change.type);
                    return (
                        <li key={`${index}-${changeIndex}`}>
                            <span className="note_variant" style={{
                                width: currentLang === 'zh' ? '74px' : '104px',
                            }}>
                              <span className={`pill ${className}`}>{text}</span>
                            </span>
                            {currentLang === 'zh' ?
                                <span className="note_text" dangerouslySetInnerHTML={{ __html: processTextForSpacing(marked.marked(change.content)) }} />
                                : <span className="note_text" dangerouslySetInnerHTML={{ __html: marked.marked(change.content) }} />
                            }

                        </li>
                    );
                })}
            </ul>
        </div>
    ))
};

export default ChangelogComponent;
