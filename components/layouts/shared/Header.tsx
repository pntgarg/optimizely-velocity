import { HeaderClient } from './Header.client';
import { getAllSearchableContent } from '../../../lib/search';
import {
  getHeaderData,
  type LayoutLink,
  type MegaMenuGroupData,
  type MenuNavigationData,
} from '../../../lib/appLayout';
import type { NavigationItem } from '../../../lib/navigation';

const linkUrl = (link: LayoutLink | null | undefined) => link?.url?.default ?? '#';

const toNavigationLink = (link: LayoutLink, index: number): NavigationItem => ({
  key: link.url?.default ?? link.text ?? `link-${index}`,
  displayName: link.text ?? link.title ?? '',
  url: linkUrl(link),
  isActive: false,
  items: null,
});

const toNavigationColumn = (column: MenuNavigationData, index: number): NavigationItem => ({
  key: column._metadata?.key ?? `column-${index}`,
  displayName: column.MenuNavigationHeading ?? column._metadata?.displayName ?? '',
  url: '#',
  isActive: false,
  items: (column.NavigationLinks ?? []).map(toNavigationLink),
});

const toNavigationItem = (item: MegaMenuGroupData, index: number): NavigationItem => ({
  key: item._metadata?.key ?? `menu-${index}`,
  displayName: item.MenuMenuHeading ?? item._metadata?.displayName ?? '',
  url: item.MegaMenuUrl?.default ?? '#',
  isActive: false,
  items: (item.MegaMenuContentArea ?? []).map(toNavigationColumn),
});

export const Header = async ({ locale = 'en' }: { locale?: string } = {}) => {
  const header = await getHeaderData(locale);
  const searchableContent = await getAllSearchableContent();
  const navigationItems = (header?.mainMenu ?? []).map(toNavigationItem);
  const serviceButtons = (header?.serviceButtons ?? [])
    .filter(button => button._metadata?.displayName)
    .map(button => ({
      key: button._metadata?.key ?? button._metadata?.displayName ?? 'button',
      text: button._metadata?.displayName ?? '',
      href: button._metadata?.url?.default ?? '#',
    }));

  return (
    <HeaderClient
      navigationItems={navigationItems}
      mobileNavItems={navigationItems}
      searchableContent={searchableContent}
      logoUrl={header?.layoutsitelogo?.url?.default}
      serviceButtons={serviceButtons}
    />
  );
};
