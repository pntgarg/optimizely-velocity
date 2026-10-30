import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getClient } from '@optimizely/cms-sdk';
import { cache } from 'react';

const graphQueryFolder = join(process.cwd(), 'components/layouts/graphQuery');
const headerQuery = readFileSync(join(graphQueryFolder, 'getHeaderData.graphql'), 'utf8');
const footerQuery = readFileSync(join(graphQueryFolder, 'getFooterData.graphql'), 'utf8');

type ContentUrl = {
  default?: string | null;
  base?: string | null;
  hierarchical?: string | null;
} | null;

export type LayoutLink = {
  title?: string | null;
  text?: string | null;
  target?: string | null;
  url?: ContentUrl;
};

export type MenuNavigationData = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
  } | null;
  MenuNavigationHeading?: string | null;
  NavigationLinks?: LayoutLink[] | null;
};

export type MegaMenuGroupData = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
  } | null;
  MenuMenuHeading?: string | null;
  MegaMenuUrl?: ContentUrl;
  MegaMenuContentArea?: MenuNavigationData[] | null;
};

export type ServiceButtonData = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
    url?: ContentUrl;
  } | null;
};

export type HeaderLayout = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
  } | null;
  appIdentifiers?: string | null;
  layoutsitelogo?: {
    url?: ContentUrl;
  } | null;
  mainMenu?: MegaMenuGroupData[] | null;
  serviceButtons?: ServiceButtonData[] | null;
};

export type FooterLayout = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
  } | null;
  appIdentifiers?: string | null;
  copyright?: string | null;
  footerMenus?: MenuNavigationData[] | null;
  legalLinks?: LayoutLink[] | null;
  contactInfoHeading?: string | null;
  contactInfo?: {
    json?: {
      type: 'richText';
      children: unknown[];
    } | string | null;
  } | null;
};

export function getAppDomain() {
  const host = process.env.APPLICATION_HOST ?? '';

  try {
    return new URL(host).host;
  } catch {
    return host.replace(/\/$/, '');
  }
}

async function queryLayout<T>(query: string, locale: string) {
  const domain = getAppDomain();
  const data = await getClient().request(query, {
    domain,
    locale: [locale],
  });
  const items = data?.appLayout?.items as T[] | undefined;

  return items?.[0] ?? null;
}

export const getHeaderData = cache(async (locale = 'en') => {
  return queryLayout<HeaderLayout>(headerQuery, locale);
});

export const getFooterData = cache(async (locale = 'en') => {
  return queryLayout<FooterLayout>(footerQuery, locale);
});
