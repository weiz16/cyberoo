import Head from 'next/head';
import React from 'react';

import Router from 'next/router';
import SearchBar from '@components/search';

export default function Home() {


  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Cyberoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Cyber
          <span className='text-amber-500'>oo.</span>
        </h1>
        <h3 className='pt-2' >Explore connections</h3>
        <SearchBar updateResult={(address) => {
          Router.push(`profile/${address}`);
        }}></SearchBar>
      </main>

    </div>
  );
}
