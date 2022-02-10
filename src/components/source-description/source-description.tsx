import HoverField from "@components/hover-field";
import { fromNow, truncateAddress } from "helpers";
import { startCase } from "lodash";
import React from "react";
import { SourceConnection } from "services";

const SourceDescription: React.FC<{connection: SourceConnection, address: string}> = ({ connection, address })  => {
  const { link } = connection || {};
  const { label, description } = connection?.type || {};
  const { amount, timestamp  } = connection?.payload || {};
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
          <div className="flex flex-col flex-col ml-auto items-end shrink-0 font-bold text-rose-600">
             <HoverField extraClass={'font-bold text-sm'} 
                text={amount} 
                start={<span>-</span>}
                end={<span className="pl-1">eth</span>}
              >
             </HoverField>
             <div className="text-zinc-400 text-sm font-normal">
              {fromNow(timestamp)}
            </div>
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
          <div className="flex ml-auto items-end flex-col shrink-0 font-bold text-emerald-600">
            <HoverField extraClass={'font-bold text-sm'} 
                text={amount} 
                start={ <span>+</span>}
                end={<span className="pl-1">eth</span>}
              >
             </HoverField>
            <div className="text-zinc-400 text-sm font-normal">
              {fromNow(timestamp)}
            </div>
          </div>
        </div>
      )}

      {label === 'OpenSea' && (
        <div className="flex w-full">
          <div className="flex flex-col">
            <div className="font-bold">OpenSea</div>
            <div className="text-sm text-zinc-400 break-all">
              <a  target="_blank" className="inline-block" href={link}>{truncatedAddress}</a>
            </div>
          </div>
          <div className="flex flex-col ml-auto">
            <div className="font-bold">{startCase(description)}</div>
          </div>
        </div>
      )}


    </>
  );
};

export default SourceDescription;