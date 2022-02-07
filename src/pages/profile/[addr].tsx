import NetworkMap from "@components/network/network-map";
import { copyToClipboard, isAddressValid, openLinkInTab } from "helpers";
import { ConnectionProfile, discoverConnection, getAddressAsset, LinkedConnections, SourceConnection } from "services";
import { HiOutlineDuplicate } from "react-icons/hi";
import useSWR from 'swr';
import { Avatar } from "@mui/material";

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
      <span className='text-amber-500'>oo.</span>
    </div>
  );
}

const Error: React.FC<{address: string}> = ({ address })  => {
  return <div>{`Address ['${address}'] is not an valid address`}</div>;
}

const AddressField: React.FC<{address: string, hideCopy?: boolean}> = ({ address, hideCopy })  => {
  return (
    <div className="flex p-2 bg-neutral-100 rounded-md items-center w-full cursor-pointer" onClick={() => !hideCopy && copyToClipboard(address)}>
      <div className="truncate self-start">{address}</div>
      {!hideCopy && <HiOutlineDuplicate size={18} className="shrink-0 text-amber-500"></HiOutlineDuplicate>}
    </div>
  );
}


const ProfileContent: React.FC<{profile: ConnectionProfile}> = ({ profile })  => {
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex-col flex w-80 p-4 shadow-md border-b-2 box-border align-middle items-center self-start">
          <Avatar   sx={{ width: 86, height: 86 }} src={profile?.images?.[0]}>
            {profile?.address}
          </Avatar>
          <div className="text-2xl mb-2 w-40 truncate text-center align-middle font-bold">{profile?.domain || profile?.address}</div>
          <AddressField address={profile?.address}></AddressField>
        </div>

        <div className="flex-col w-80 p-4 mt-4 shadow-md border-b-2 box-border align-middle self-start">
          <div className="flex flex-col items-center"> 
              <div className="flex items-center flex-col">
                <div className="text-5xl text-amber-500">
                  {Object.keys(profile?.linkedConnections || {})?.length}
                </div>
                <div className="text-md">
                  Connections
                </div>
              </div>
              <div className=" mt-4 h-80 overflow-auto w-full">
                {Object.keys(profile?.linkedConnections || {})?.map((address) => {
                  return (
                    <div key={address}  onClick={() => openLinkInTab(address)} className="truncate mb-2">
                      <AddressField address={address} hideCopy={true}></AddressField>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>

      </div>


      <div className="flex p-4 pr-0 w-full bg-zinc-50 rounded-md ml-6 shadow-md border-b-2 box-border"> 

        <div className="w-full h-full rounded-md mr-4">
          <NetworkMap address={profile?.address} connections={profile?.linkedConnections as LinkedConnections}></NetworkMap>
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