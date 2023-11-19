import React from 'react';
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

const DocCardListComponent = () => {
    const currentCategory = useCurrentSidebarCategory();
    return <DocCardList items={currentCategory.items} />;
};

export default DocCardListComponent;
