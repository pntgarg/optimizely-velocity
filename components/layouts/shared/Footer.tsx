import Link from 'next/link';
import type { ComponentProps } from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { Logo } from './Logo';
import {
  getFooterData,
  type LayoutLink,
  type MenuNavigationData,
} from '../../../lib/appLayout';

const linkLabel = (link: LayoutLink) => link.text ?? link.title ?? link.url?.default ?? '';

const FooterMenus = ({ menus }: { menus: MenuNavigationData[] }) => (
  <>
    {menus.map(menu => (
      <div className='col-span-1' key={menu._metadata?.key ?? menu.MenuNavigationHeading}>
        <h4 className='font-bold text-foreground uppercase text-xs tracking-wider mb-4'>
          {menu.MenuNavigationHeading}
        </h4>
        <ul className='space-y-2'>
          {(menu.NavigationLinks ?? []).map(link => (
            <li key={link.url?.default ?? link.text}>
              <Link
                href={link.url?.default ?? '#'}
                target={link.target ?? undefined}
                className='hover:text-foreground'
              >
                {linkLabel(link)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

export const Footer = async ({ locale = 'en' }: { locale?: string } = {}) => {
  const footer = await getFooterData(locale);
  const menus = footer?.footerMenus ?? [];
  const legalLinks = footer?.legalLinks ?? [];

  return (
    <footer className='pt-20 pb-12 bg-background md:px-12'>
      <div className='container mx-auto'>
        <Link href='/'>
          <Logo className='h-5' />
        </Link>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 pt-16 text-sm text-foreground2'>
          <div className='col-span-1'>
            <div className='space-y-2'>
              {footer?.contactInfoHeading ?
                <p className='font-bold text-foreground uppercase text-xs tracking-wider mb-2'>
                  {footer.contactInfoHeading}
                </p>
              : null}
              {footer?.contactInfo?.json ?
                <RichText
                  content={
                    footer.contactInfo.json as NonNullable<
                      ComponentProps<typeof RichText>['content']
                    >
                  }
                />
              : null}
            </div>
          </div>
          <FooterMenus menus={menus} />
        </div>
        <div className='border-t border-white/5 mt-12 pt-8 text-sm text-foreground2 flex flex-col gap-3 items-center justify-center'>
          {footer?.copyright ? <p>{footer.copyright}</p> : null}
          {legalLinks.length > 0 ?
            <ul className='flex flex-wrap gap-4 justify-center'>
              {legalLinks.map(link => (
                <li key={link.url?.default ?? link.text}>
                  <Link
                    href={link.url?.default ?? '#'}
                    target={link.target ?? undefined}
                    className='hover:text-foreground'
                  >
                    {linkLabel(link)}
                  </Link>
                </li>
              ))}
            </ul>
          : null}
        </div>
      </div>
    </footer>
  );
};
