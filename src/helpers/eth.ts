// Helper for ethereum such as checking if an address is valid

import web3 from "./web3";


/**
 * If a given address is valid or not, 
 * @param address eth address
 * @returns boolean indicating if an address is valid or not
 */
 export function isAddressValid(address: string): boolean {
  let valid = false;
  try {
    if (address) {
      web3.utils.toChecksumAddress(address);
      valid = true;
    }
  } catch (error) {
    valid = false;
  }
  return valid;
}