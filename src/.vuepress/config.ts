import { defaultTheme } from 'vuepress'

module.exports = {
    lang: 'zh-CN',
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'VuePress',
            description: 'Vue 驱动的静态网站生成器',
        },
        '/en/': {
            lang: 'en-US',
            title: 'VuePress',
            description: 'Vue-powered Static Site Generator',
        },
    },
    theme: defaultTheme({
        locales: {
            '/': {
                navbar: [
                    { text: '首页', link: '/' },
                ],
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',
            },
            '/en/': {
                navbar: [
                    { text: 'Home', link: '/en/' },
                ],
                selectLanguageName: 'English',
            },
        },
    }),
}