import Head from 'next/head';
import React from 'react';

import { ISearchBarQueryResult, SearchBar } from '../components/search/search';
import { UserIdentity } from 'services';
import NetworkMap from '@components/network/network-map';

export default function Home() {

  const [result, setResult] = React.useState<ISearchBarQueryResult<UserIdentity>>({});

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Cyberoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Cyber
          <span className='text-primary'>oo.</span>
        </h1>
        <h3 className='pt-2' >Explore connections</h3>
        <SearchBar updateResult={setResult}></SearchBar>
        {/* {result?.data ? <UserCard {...{ user: result.data || {} as any}}></UserCard> : <></>} */}
        <NetworkMap></NetworkMap>
      </main>

    </div>
  );
}
