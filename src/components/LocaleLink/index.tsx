import { useLocale } from 'next-intl';
import Link from 'next/link'
import React from 'react'
/**
 * 国际化Link组件
 *
 * @param children Link的子元素
 * @param href Link地址
 * @param className Link的样式类名
 * @returns 返回Link组件
 */
const LocaleLink = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => {
    const locale = useLocale();
    return (
        <Link href={"/" + locale + href} className={className}>
            {children}
        </Link>
    )
}

export default LocaleLink