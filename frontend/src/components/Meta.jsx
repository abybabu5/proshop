import React from 'react';
import {Helmet} from "react-helmet";

const Meta = ({title, description, keywords}) => {

    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content='description'/>
            <meta name='keyword' content={keywords}/>
        </Helmet>
    );
}
Meta.defaultProps = {
    title: 'Welcome To ProShop',
    description: 'We sell best product for cheap',
    keywords: 'electronics, buy electronics, cheap electronics',
}
export default Meta;
