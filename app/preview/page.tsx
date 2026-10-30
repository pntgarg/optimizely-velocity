import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { withAppContext } from '@optimizely/cms-sdk/react/server';
import { Metadata } from 'next';
import { cache } from 'react';
import { Footer } from '../../components/layouts/shared/Footer';
import { Header } from '../../components/layouts/shared/Header';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getPreviewContent = cache(async (params: PreviewParams) => {
  return await getClient()
    .getPreviewContent(params)
    .catch(err => {
      console.log(err.errors);
      console.log(err.request?.query);
      throw err;
    });
});

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = (await searchParams) as PreviewParams;
  const content = await getPreviewContent(params);

  return {
    title: `Previewing — ${content._metadata.displayName}`,
  };
}

async function Page({ searchParams }: Props) {
  const params = (await searchParams) as PreviewParams;
  const content = await getPreviewContent(params);

  const locale = content._metadata?.fallbackForLocale ?? content._metadata?.locale ?? 'en';

  return (
    <>
      <Header locale={locale} />
      <main className='pt-32'>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </main>
      <Footer locale={locale} />
    </>
  );
}

export default withAppContext(Page);
