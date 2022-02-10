import { copyToClipboard, openLinkInTab, openProfileLink, truncateAddress } from "helpers";
import { BasicInfoConnection, ConnectionProfile, getAddressProfile, getCyberConnectProfileLink, getFollowers, getFollowings, getUserIdentity, SourceConnection } from "services";
import { HiOutlineDuplicate } from "react-icons/hi";
import useSWR from 'swr';
import { Avatar, Box, Modal, Pagination, Popover, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import SourceAvatar from "@components/source-avatar";
import SourceDescription from "@components/source-description";
import HoverField from "@components/hover-field";
import { startCase } from "lodash";
import NetworkMap from "@components/network-map";

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
    <div className="text-4xl bg-white font-bold p-4 border-b-2">
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

const ProfileBalance: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {
  return (
    <div className="grid grid-cols-1 w-full divide-y p-6 h-full items-center">
      {profile.balance}
    </div>
  )
};


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

const ProfileFollower: React.FC<{profile: ConnectionProfile, type: 'followers' | 'followings'}> = ({ profile, type })  => {
  const initialUser: BasicInfoConnection = profile[type];
  const [user, setUser ] = React.useState<BasicInfoConnection>(initialUser);
  const pageSize = 20;
  
  const handleChange = (_: any, value: number) => {
    (type === 'followers' ? getFollowers : getFollowings)({ address: profile.address, pageSize, offset: (value - 1) * pageSize - 1 }).then((identity) => {
      setUser(identity[type]);
    });
  };
  
  const followCounts = type === 'followings' ? profile.followingCount : profile.followerCount;

  const count = Number(Math.ceil((Number(followCounts)) / pageSize));
  return (
    <div className="grid grid-cols-1 w-full divide-y p-6 h-full items-center">
      <div className="flex flex-col items-center pb-4">
        <div className="text-4xl font-bold ">{followCounts}</div>
        <div className="text-sm text-zinc-400">{startCase(type)}</div>
      </div>
      <div className="grid grid-cols-2 h-full pt-4 items-center overflow-auto">
        {user?.list?.map((follower) => {
          return (
            <div onClick={() => openProfileLink(follower?.address)} className="bg-zince-200 rounded-md p-2 text-center select-none cursor-pointer">{truncateAddress(follower.domain || follower.address, follower.domain ? 20 : 12)}</div>
          );
        })}
      </div>
      <div className="flex align-middle justify-center w-full">
        <Pagination className="pt-2" count={count} onChange={handleChange} defaultPage={1} color="primary" />
      </div>

    </div>
  );
};

const ProfileContentDetail: React.FC<{profile: ConnectionProfile, updater?: any }> = ({ profile, updater })  => {
  const { address, balance, followingCount, followerCount } = profile || {};
  const profileDetailHandler = (type: 'followings' | 'followers') => {
  updater?.setChildren((
    <div className="absolute top-1/2 rounded-lg left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/12 h-2/3 bg-white">
      <ProfileFollower profile={profile} type={type}/>
    </div>
  ));
  updater?.setOpen(true);
  };

  return (
    <div className="flex flex-col select-none ">
    <div className="flex-col flex w-80 p-4 bg-white  shadow-lg rounded-lg box-border align-middle items-center self-start">
      <Avatar sx={{ width: 86, height: 86 }} src={profile?.images?.[0]}>
        {profile?.address}
      </Avatar>
      <div className="text-2xl mb-2 w-40 truncate text-center align-middle font-bold pt-2 ">{profile?.domain || profile?.address}</div>
      <CopyField text={address}>
        <div className="flex p-2 text-sm flex items-center w-full bg-gray-100 text-gray-600 rounded-md ">
          <div className="self-start">{truncateAddress(address, 33)}</div>
          {<HiOutlineDuplicate size={18} className="shrink-0 text-slate-800 ml-auto"></HiOutlineDuplicate>}
        </div>
      </CopyField>
      
      <div className="grid grid-cols-3 divide-x mt-4 w-full cursor-pointer">
        <div className="flex flex-col items-center">
          <div className="text-l font-bold text-zinc-500"  onClick={() => profileDetailHandler('followers')}>
            {followerCount}
          </div>
          <div className="text-zinc-500 text-xs">
            Followers
          </div>
        </div>
        <div className="flex flex-col items-center">
        <div className="text-l font-bold text-zinc-500"  onClick={() => profileDetailHandler('followings')}>
            {followingCount}
          </div>
          <div className="text-zinc-500 text-xs">
            Followings
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

  );
};

const ProfileContent: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {

  const [open, setOpen] = React.useState(false);
  const [children, setChildren] = React.useState<ReactElement>(<></>);
  
  const handleClose = () => setOpen(false);
  return (
    <>
      <ProfileContentDetail profile={profile} updater={{ setChildren, setOpen} } />

      <div className="flex flex-col w-full ml-6 bg-transparent">
        <div className="flex  pr-0 w-full bg-white rounded-md shadow-lg border-b-2 box-border h-full"> 
          <div className="w-full h-full rounded-md mr-4">
            <NetworkMap profile={profile} showModal={(children) => {
              setChildren(children);
              setOpen(true);
            }}></NetworkMap>
          </div>
        </div>
      </div>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {children && children}
      </Modal>

    </>
  );
};

const ProfilePage: React.FC<{addr: string}> = ({ addr }) => {

  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {

    fetch(`${process.env.CORE_API_URL}${addr}`).then(async (res) => {
      if (res.status === 200) {
        const profile = await res.json();
        setData(profile);
      } else {
        setError(true);
      }
    }).catch((err) => {
      setError(true);
    });

  }, [])

  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Header></Header>
      <div className="flex mt-2 p-5 box-border ">
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