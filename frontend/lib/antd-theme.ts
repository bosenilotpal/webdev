import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        colorPrimary: '#4CAF50', // Green color matching existing CSS
        colorLink: '#4CAF50',
        colorSuccess: '#4CAF50',
        colorInfo: '#4CAF50',
        borderRadius: 6,
    },
    components: {
        Button: {
            colorPrimary: '#4CAF50',
            colorPrimaryHover: '#45a049',
            colorPrimaryActive: '#3d8b40',
            primaryColor: '#ffffff',
        },
        Input: {
            colorPrimaryHover: '#4CAF50',
            hoverBorderColor: '#4CAF50',
            activeBorderColor: '#4CAF50',
        },
        InputNumber: {
            colorPrimaryHover: '#4CAF50',
            hoverBorderColor: '#4CAF50',
            activeBorderColor: '#4CAF50',
        },
        Select: {
            colorPrimaryHover: '#4CAF50',
            colorPrimary: '#4CAF50',
        },
        Table: {
            colorPrimary: '#4CAF50',
            colorLink: '#4CAF50',
            colorLinkHover: '#45a049',
        },
    },
};

export default theme;
