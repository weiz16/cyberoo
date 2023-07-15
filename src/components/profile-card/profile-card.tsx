import CopyField from "@components/copy-field";
import HoverField from "@components/hover-field";
import SourceAvatar from "@components/source-avatar";
import SourceDescription from "@components/source-description";
import { Avatar, Pagination } from "@mui/material";
import { openLinkInTab, openProfileLink, truncateAddress } from "helpers";
import { startCase } from "lodash";
import React from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BasicInfoConnection, ConnectionProfile, getAddressProfile, getFollowers, getFollowings, SourceConnection } from "services";

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



const ProfileCard: React.FC<{profile: ConnectionProfile, size?: 'large' | 'medium'; updater?: any }> = ({ profile, updater, size })  => {

  const [data, setData] = React.useState(profile);
  const [isLoading, setIsLoading] = React.useState(true);
  const { address, balance, followingCount, followerCount } = data || {};

  const isLarge = size === 'large';

  if (isLarge && isLoading) {
    fetch(`${process.env.CORE_API_URL}${profile.address}`).then(async (res) => {
      if (res.status === 200) {
        const profile = await res.json();
        setIsLoading(false);
        setData(profile);
      } else {
        // setError(true);
      }
    }).catch((err) => {
      // setError(true);
    });
  } else {

  }
  const profileDetailHandler = (type: 'followings' | 'followers') => {
    updater?.setChildren((
      <div className="absolute top-1/2 rounded-lg left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/12 h-2/3 bg-white">
        <ProfileFollower profile={data} type={type}/>
      </div>
    ));
    updater?.setOpen(true);
  };


  return (
    <div className={`flex flex-col select-none ${isLarge ? 'w-full' : ''}`}>
    <div className={`flex-col flex ${isLarge ? 'w-full' : 'w-80'} p-4 bg-white  ${isLarge ? '' : 'shadow-lg'} rounded-lg box-border align-middle items-center self-start`}>
      <Avatar sx={{ width: 86, height: 86 }} src={data?.images?.[0]}>
        {data?.address}
      </Avatar>
      <div className="text-2xl mb-2 w-40 truncate text-center align-middle font-bold pt-2 ">{data?.domain || data?.address}</div>
      <div className={`${isLarge ? 'w-auto' : 'w-full'}`}>
        <CopyField text={address}>
          <div className={`flex p-2 text-sm flex ${isLarge ? 'w-auto' : 'w-full'} items-center bg-gray-100 text-gray-600 rounded-md `}>
            <div className="self-start pr-2">{isLarge ? address : truncateAddress(address, 33)}</div>
            {<HiOutlineDuplicate size={18} className="shrink-0 text-slate-800 ml-auto"></HiOutlineDuplicate>}
          </div>
        </CopyField>
      </div>

      
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
        {<ProfileList profile={data}></ProfileList>}
      </div>

    </div>
  </div>

  );
};

const Profile = {
  ProfileCard,
  ProfileFollower
};

export default Profile;