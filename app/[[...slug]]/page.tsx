import { getClient } from '@optimizely/cms-sdk';
import { setContext, withAppContext } from '@optimizely/cms-sdk/react/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Footer } from '../../components/layouts/shared/Footer';
import { Header } from '../../components/layouts/shared/Header';
import { getFooterData, getHeaderData } from '../../lib/appLayout';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

const defaultSlug: string[] = [];

const getContentBySlug = cache(async (slug: String[]) => {
  const path = `/${slug.join('/')}`;
  const result = await getClient().getContentByPath(path);

  if (result.length === 0) {
    return null;
  }

  return result[0];
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlug(slug ?? defaultSlug);

  if (content === null) {
    return {
      title: 'optimizely-velocity — Page Not Found',
    };
  }

  // TODO: Add SEO fields and render as metadata
  return {
    title: `optimizely-velocity — ${content._metadata.displayName}`,
    description: '',
  };
}

export async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getContentBySlug(slug ?? defaultSlug);

  if (content === null) {
    notFound();
  }

  const locale = content._metadata.fallbackForLocale ?? content._metadata.locale ?? 'en';

  setContext({
    currentContent: content,
    key: content._metadata.key,
    type: content._metadata.types[0],
    locale,
  });

  const [header, footer] = await Promise.all([
    getHeaderData(locale),
    getFooterData(locale),
  ]);

  return (
    <>
      <Header layout={header} locale={locale} />
      <main className='pt-32'>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </main>
      <Footer layout={footer} locale={locale} />
    </>
  );
}

export default withAppContext(Page);
