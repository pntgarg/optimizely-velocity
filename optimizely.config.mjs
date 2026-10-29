import { buildConfig } from '@optimizely/cms-sdk';

export default buildConfig({
  components: [
    './components/**/model.ts',
    './components/*.tsx',
    './components/**/*.tsx',
    './components/contracts/*.ts',
  ],
  propertyGroups: [
    {
      key: 'header',
      displayName: 'Header',
      sortOrder: 10,
    },
    {
      key: 'footer',
      displayName: 'Footer',
      sortOrder: 20,
    },
    {
      key: 'application',
      displayName: 'Advanced',
      sortOrder: 30,
    },
  ],
  locale: ['en'],
  content: [
    {
      key: 'home',
      displayName: 'Home',
      contentType: 'StartPage',
      locale: 'en',
    },
  ],
  applications: [
    {
      key: 'optimizely-velocity',
      entryPoint: 'home',
      displayName: 'optimizely-velocity',
      type: 'website',
      isDefault: true,
      useApplicationSpecificAssets: false,
      hosts: [
        {
          authority: 'localhost:3000',
          type: 'primary',
          preferredUrlScheme: 'https',
        },
      ],
      usePreviewTokens: true,
    },
  ],
});
