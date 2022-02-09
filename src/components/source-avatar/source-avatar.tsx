import { HiCurrencyYen } from "react-icons/hi";
import { SourceConnection } from "services";
import Image from 'next/image';

const SourceAvatar: React.FC<{connection: SourceConnection}> = ({ connection })  => {
  const { label } = connection?.type || {};
  let bgColor = 'bg-yellow-300';
  if (label === 'CyberConnect') {
    bgColor = 'bg-zinc-200'
  }
  if (label === 'OpenSea') {
    bgColor = 'bg-blue-100'
  }
  return (
    <div className={`${bgColor} w-10 h-10 rounded-full items-center justify-center flex shrink-0`}>
      {label === 'Transfer' && <HiCurrencyYen size={24}></HiCurrencyYen>}
      {label === 'CyberConnect' && <Image className="rounded-full" width={24} height={24} src='/cc-logo.svg'></Image>}
      {label === 'OpenSea' && <Image className="rounded-full" width={24} height={24} src='/opensea.svg'></Image>}
    </div>
  );
};

export default SourceAvatar;