import NetworkMap from "@components/network/network-map";
import { copyToClipboard, isAddressValid, openLinkInTab, truncateAddress } from "helpers";
import { ConnectionProfile, discoverConnection, getAddressAsset, LinkedConnections, PickedConnection, SourceConnection, SourceConnectionPayload, TransferConnectionPayload } from "services";
import { HiOutlineDuplicate, HiCurrencyYen } from "react-icons/hi";
import useSWR from 'swr';
import { Avatar, List, Popover, Typography } from "@mui/material";
import React from "react";
import Image from 'next/image'
import Moment from "react-moment";

const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};

const Header: React.FC<{}> = () => {
  return (
    <div className="text-4xl font-bold p-4 border-b-2">
      Cyber
      <span className='text-yellow-300'>oo.</span>
    </div>
  );
}

const Error: React.FC<{address: string}> = ({ address })  => {
  return <div>{`Address ['${address}'] is not an valid address`}</div>;
}

const AddressField: React.FC<{address: string, hideCopy?: boolean, truncateLen?: number }> = ({ address, hideCopy, truncateLen })  => {

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [copyText, setCopyText] = React.useState<string>('Copy');

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCopied = () => {
    !hideCopy && copyToClipboard(address);
    setCopyText('Copied!');
    setTimeout(() => {
      setAnchorEl(null);
      setCopyText('Copy');
    }, 1500);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="w-full">
    <Typography
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div className="flex p-2 bg-neutral-200 text-zinc-400 rounded-md items-center w-full cursor-pointer" onClick={handleCopied}>
        <div className="self-start">{truncateAddress(address, truncateLen || 10)}</div>
        {!hideCopy && <HiOutlineDuplicate size={18} className="shrink-0 text-slate-800 ml-auto"></HiOutlineDuplicate>}
      </div>
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{copyText}</Typography>
      </Popover>
    </div>
  );
}

const SourceDescription: React.FC<{connection: PickedConnection, address: string}> = ({ connection, address })  => {
  const { link, type: { label, description } } = connection || {};
  const { amount, timestamp  } = connection?.payload as TransferConnectionPayload || {};
  const truncatedAddress = truncateAddress(address, 12);
  return (
    <>
      {label === 'CyberConnect' && description === 'followed' && (
        <div className="flex w-full">
          <div className="flex flex-col">
            <div className="font-bold">CyberConnect</div>
            <div className="text-sm text-zinc-400 break-all">
              <a  target="_blank" className=" inline-block" href={link}>{truncatedAddress}</a>
            </div>
          </div>
          <div className="flex flex-col ml-auto">
            <div className="font-bold">Followed</div>
          </div>
        </div>
      )}
      {label === 'CyberConnect' && description === 'following' && (
        <div className="flex w-full">
          <div className="flex flex-col">
            <div className="font-bold">CyberConnect</div>
            <div className="text-sm text-zinc-400 break-all">
              <a  target="_blank" className="inline-block " href={link}>{truncatedAddress}</a>
            </div>
          </div>
          <div className="flex flex-col ml-auto">
            <div className="font-bold">Following</div>
          </div>
      </div>
      )}

      {label === 'Transfer' && description === 'sent' && (
        <div className="flex w-full">
          <div className="flex flex-col">
            <div className="font-bold">Transfer</div>
            <div className="text-sm text-zinc-400 break-all">
             <a  target="_blank" className="inline-block flex " href={link}>{`To ${truncatedAddress}`}</a>
            </div>
          </div>
          <div className="flex flex-col ml-auto shrink-0">
            <div className="font-bold text-rose-600">-{amount} eth</div>
          </div>
      </div>
      )}

      {label === 'Transfer' && description === 'received' && (
        <div className="flex w-full">
          <div className="flex flex-col">
            <div className="font-bold">Transfer</div>
            <div className="text-sm text-zinc-400 break-all">
            <a  target="_blank" className="inline-block flex " href={link}>{`From ${truncatedAddress}`}</a>
            </div>
          </div>
          <div className="flex flex-col ml-auto shrink-0">
            <div className="font-bold text-emerald-500">+{amount} eth</div>
          </div>
        </div>
      )}

    </>
  );
};

const SourceAvatar: React.FC<{connection: PickedConnection}> = ({ connection })  => {
  const { label } = connection?.type || {};
  return (
    <div className={`${label === 'CyberConnect' ? 'bg-zinc-200' : 'bg-yellow-300'} w-10 h-10 rounded-full items-center justify-center flex shrink-0`}>
      {label === 'Transfer' && <HiCurrencyYen size={24}></HiCurrencyYen>}
      {label === 'CyberConnect' && <Image className="rounded-full" width={24} height={24} src='/cc-logo.svg'></Image>}
    </div>
  );
};

const ProfileList: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {
  return (
    <div className="flex-col align-middle self-start">
    <div className="flex flex-col "> 
        {/* <div className="flex items-center flex-col">
          <div className="text-5xl text-yellow-300">
            {Object.keys(profile?.linkedConnections || {})?.length}
          </div>
          <div className="text-md">
            Connections
          </div>
        </div> */}
        <div className="text-xl font-bold pl-2 pb-4" >Highlights 
          <span className="inline-block text-blue-400 text-l pl-1">({Object.keys(profile?.linkedConnections || {}).length})</span>
        </div>
        <div className="h-80 overflow-y-auto w-full">
          {Object.keys(profile?.linkedConnections || {})?.map((address) => {
            const connections: PickedConnection[] = profile?.linkedConnections?.[address] || [];
            return (
              <div key={address} className="select-none">
                {/* <AddressField address={address} hideCopy={true}></AddressField> */}
                {connections.map((c: PickedConnection, index) => {
                    return (
                      <div key={index} className="flex align-middle items-center p-2 mb-2">
                        <div className="mr-4">
                          <SourceAvatar connection={c}></SourceAvatar>
                        </div>
                        <SourceDescription connection={c} address={address}></SourceDescription>
                    </div>
                    );
                })}
              </div>
            );
          })}
        </div>
      </div>
  </div>
  );
};

const ProfileContent: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {

  type DisplayMode = 'list' | 'graph';
  const [mode, setMode] = React.useState<DisplayMode>('list');
  const updateMode = (mode: DisplayMode) => {
    setMode(mode);
  };
  return (
    <>
      <div className="flex flex-col select-none ">
        <div className="flex-col flex w-80 p-4 shadow-md border-b-2 box-border align-middle items-center self-start">
          <Avatar sx={{ width: 86, height: 86 }} src={profile?.images?.[0]}>
            {profile?.address}
          </Avatar>
          <div className="text-2xl mb-2 w-40 truncate text-center align-middle font-bold">{profile?.domain || profile?.address}</div>
          <AddressField address={profile?.address} truncateLen={29}></AddressField>
          
          <div className="pt-4">
            {profile.twitter}
          </div>
          {<ProfileList profile={profile}></ProfileList>}
        </div>
      </div>


      <div className="flex p-4 pr-0 w-full rounded-md ml-6 shadow-md border-b-2 box-border"> 
        <div className="w-full h-full rounded-md mr-4">
          {/* {mode === 'list' && <ProfileList profile={profile}></ProfileList>} */}
          {<NetworkMap address={profile?.address} connections={profile?.linkedConnections as LinkedConnections}></NetworkMap>}
        </div>
      </div>
    </>
  );
};

const ProfilePage: React.FC<{addr: string}> = ({ addr }) => {

  const { data, error } = useSWR<ConnectionProfile>(`${process.env.CORE_API_URL}${addr}`, fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Header></Header>
      <div className="flex mt-2 p-5 box-border">
        {error ? <Error address={addr} /> : <ProfileContent profile={data} />}
      </div>
    </div>
  );
};

export default ProfilePage;


export async function getServerSideProps(context: any): Promise<{props: any}> {
  const { addr } = context.params;
  return { props: { addr }};
};