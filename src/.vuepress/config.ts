import { defaultTheme } from 'vuepress'

module.exports = {
    lang: 'zh-CN',
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'JustSignSSL',
            description: '简单易用的 SSL 证书生成工具',
        },
        '/en/': {
            lang: 'en-US',
            title: 'JustSignSSL',
            description: 'Easy-to-use SSL certificate generation tool',
        },
    },
    theme: defaultTheme({
        sidebarDepth: 1,
        locales: {
            '/': {
                navbar: [
                    { text: '首页', link: '/' },
                ],
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',
                sidebar: [
                    { text: '现在开始', link: '/' },
                    { text: 'CA 配置', link: '/ca.html' },
                    { text: '后端部署', link: '/backend.html' },
                    { text: '前端部署', link: '/frontend.html' }
                ]
            },
            '/en/': {
                navbar: [
                    { text: 'Home', link: '/en/' },
                ],
                selectLanguageName: 'English',
                sidebar: [
                    { text: 'Getting started', link: '/en/' },
                    { text: 'CA Configuration', link: '/en/ca.html' },
                    { text: 'Backend Deploy', link: '/en/backend.html' },
                    { text: 'Frontend Deploy', link: '/en/frontend.html' }
                ]
            },
        },
    }),

}