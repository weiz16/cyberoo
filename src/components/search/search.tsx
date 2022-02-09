import debounce from 'lodash.debounce';
import * as React from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { isAddressValid } from 'helpers';


const SearchBar: React.FC<{updateResult: (result: string) => void }> = ({ updateResult })  => {

  const [valid, setValid] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>();

  const handleKeyDown = React.useCallback(async (ev: React.KeyboardEvent) => {
    // Store current input state
    const currentValue = (ev?.target as HTMLInputElement)?.value;
    setAddress(currentValue);

    // Store valid state 
    const canQuery = isAddressValid(currentValue);
    setValid(canQuery);

    // Perform search only if valid
    if (canQuery) {
      updateResult(currentValue as string);
    }
  }, [updateResult]);

  // Debounce keydown handler to reduce search loads
  const debouncedKeydown = debounce((ev: React.KeyboardEvent) => {
    handleKeyDown(ev);
  }, 500);

  const showInvalidUI = !valid && address;

  const invalid = () => {
    return (
      <div className={`flex text-left transition-colors mt-1 align-left duration-150 transition-opacity ${showInvalidUI ? '' : 'opacity-0' }`}>
        {<AiFillInfoCircle className='text-rose-600 mr-1'/>}
        <span className='text-rose-600 text-xs'>Not a valid address.</span>
      </div>
    );
  };

  const inputClass = `mt-4 placeholder:italic placeholder:text-slate-400 transition-border bg-white w-6/12 border border-${showInvalidUI ? 'rose' : 'slate'}-600 rounded-md p-3 shadow-sm focus:outline-none focus:border-${showInvalidUI ? 'rose' : 'sky'}-500 focus:ring-${showInvalidUI ? 'rose' : 'sky'}-500 sm:text-sm"`
  return (
    <>
      <input 
        autoComplete='off'
        className={inputClass}
        onKeyDown={debouncedKeydown} 
        placeholder="Enter ethereum address"
        type="text" name="search"/>

      {invalid()}
    </>

  );
}

export default SearchBar;