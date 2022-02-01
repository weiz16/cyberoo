import Head from 'next/head';
import debounce from 'lodash.debounce';
import React from 'react';

import { ApolloProvider, useQuery } from "@apollo/client";
import client, { GET_FOLLOWERS } from "./api/search";

export function SearchBar(updateSearch: React.Dispatch<React.SetStateAction<string>>) {

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    updateSearch((ev?.target as HTMLInputElement)?.value || '');
  };

  // Debounce keydown handler to reduce search loads
  const debouncedKeydown = debounce((ev: React.KeyboardEvent) => {
    handleKeyDown(ev);
  }, 500);

  const inputClass = "mt-4 placeholder:italic placeholder:text-slate-400 block bg-white w-6/12 border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm";
  return (
      <input 
        className={inputClass}
        onKeyDown={debouncedKeydown} 
        placeholder="Search for anything (address, nft, label etc...)"
        type="text" name="search"/>
  );
}

export function Footer() {
  return (
    <footer className="flex h-12 w-full items-center justify-center pr-4 border-t">
      <a
        className="flex items-center justify-center"
        href="https://github.com/weiz16"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact
      </a>
    </footer>
  );
}

export function Heading() {
  return (
    <>
      <h1 className="text-6xl font-bold">
        Cyberoo
      </h1>
      <h3 className='pt-2' >Explore all connections!</h3>
    </>
  );
}

export function Result(query: string) {
  // const { loading, error, data } = useQuery(GET_FOLLOWERS(query));

  
  // if (loading) {
  //   return (
  //     <div className='loading'>
  //       loading...
  //     </div>
  //   );
  // }

  // if (error) return `Error! ${error.message}`;

  // if (data) {
  //   return (
  //     <div className='border border-slate-300 rounded-md p-4 mt-4'>
  //       {query}
  //       {data?.map((item: any, index: number) => {
  //         return (
  //           item?.text && <div key={index}>{item.text}</div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
}

export default function Home() {

  const [query, setQuery] = React.useState('');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Cyberoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <Heading></Heading>
        {SearchBar(setQuery)}
        {<ApolloProvider client={client}>{Result(query)}</ApolloProvider>}
      </main>

      <Footer></Footer>

    </div>
  );
}
