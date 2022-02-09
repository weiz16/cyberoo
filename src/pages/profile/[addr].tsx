import { copyToClipboard, openLinkInTab, truncateAddress } from "helpers";
import { ConnectionProfile, getAddressProfile, getCyberConnectProfileLink, SourceConnection } from "services";
import { HiOutlineDuplicate } from "react-icons/hi";
import useSWR from 'swr';
import { Avatar, Popover, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import SourceAvatar from "@components/source-avatar";
import SourceDescription from "@components/source-description";
import HoverField from "@components/hover-field";

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

const CopyField: React.FC<{text: string, children: ReactElement }> = ({ text, children })  => {

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [copyText, setCopyText] = React.useState<string>('Copy');

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCopied = () => {
    setCopyText('Copied!');
    copyToClipboard(text);
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
      <div className="cursor-pointer" onClick={handleCopied}>
        {children}
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

const ProfileList: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {
  return (
    <div className="flex-col align-middle self-start">
    <div className="flex flex-col w-full"> 

        <div className="text-l font-bold pb-1" >Recommended 
          <span className="inline-block text-yellow-400 text-l pl-1">({profile?.connections?.length})</span>
        </div>
        <div className="h-80 overflow-auto w-full">
          <div className="select-none text-sm  w-full">
            {profile?.connections?.map((c: SourceConnection, index) => {
                return (
                  <div key={index} className="flex align-middle items-center mb-6 mt-2">
                    <div className="mr-4">
                      <SourceAvatar connection={c}></SourceAvatar>
                    </div>
                    <SourceDescription connection={c} address={c?.address}></SourceDescription>
                </div>
                );
            })}
          </div>
        </div>
      </div>
  </div>
  );
};

const ProfileContent: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {

  const { address, balance, followingCount, followerCount } = profile || {};
  return (
    <>
      <div className="flex flex-col select-none ">
        <div className="flex-col flex w-80 p-4 shadow-md border-b-2 box-border align-middle items-center self-start">
          <Avatar sx={{ width: 86, height: 86 }} src={profile?.images?.[0]}>
            {profile?.address}
          </Avatar>
          <div className="text-2xl mb-2 w-40 truncate text-center align-middle font-bold pt-2 ">{profile?.domain || profile?.address}</div>
          <CopyField text={address}>
            <div className="flex p-2 text-sm flex items-center w-full bg-neutral-200 text-zinc-400 rounded-md ">
              <div className="self-start">{truncateAddress(address, 33)}</div>
              {<HiOutlineDuplicate size={18} className="shrink-0 text-slate-800 ml-auto"></HiOutlineDuplicate>}
            </div>
          </CopyField>
          
          <div className="grid grid-cols-3 divide-x mt-4 w-full cursor-pointer">
            <div className="flex flex-col items-center" onClick={() => openLinkInTab(getCyberConnectProfileLink(address))}>
              <div className="text-l font-bold text-zinc-500">
                {followerCount}
              </div>
              <div className="text-zinc-500 text-xs">
                Followers
              </div>
            </div>
            <div className="flex flex-col items-center" onClick={() => openLinkInTab(getCyberConnectProfileLink(address))}>
              <div className="text-l font-bold text-zinc-500 truncate" >
                {followingCount}
              </div>
              <div className="text-zinc-500 text-xs">
                Followers
              </div>
            </div>
            <div className="flex flex-col items-center" onClick={() => openLinkInTab(getAddressProfile(address))}>
              <HoverField extraClass={"text-l pt-0.5 font-bold text-zinc-500 truncate"} truncateLen={8} text={balance || ''}>
              </HoverField>
              <div className="text-zinc-500 text-xs">
                Balance
              </div>
            </div>
          </div>

          <div className="pt-4 w-full">
            {<ProfileList profile={profile}></ProfileList>}
          </div>

        </div>
      </div>


      <div className="flex p-4 pr-0 w-full rounded-md ml-6 shadow-md border-b-2 box-border"> 
        <div className="w-full h-full rounded-md mr-4">
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