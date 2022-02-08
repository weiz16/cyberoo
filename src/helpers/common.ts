// Common helpers used by different modules of the app


/**
 * Given a url, open it in new tab
 * @param url 
 */
export function openLinkInTab(url: string): void {
  if (!!url) {
    window.open(url, '_blank');
  }
}

/**
 * Copy a link to clipboard
 * @param address 
 */
export function copyToClipboard(address: string): void {
  navigator.clipboard.writeText(address);
}

/**
 * Truncate string in the middle
 * variation from (https://stackoverflow.com/questions/5723154/truncate-a-string-in-the-middle-with-javascript)
 * @param str 
 * @returns 
 */
export function truncateAddress(fullStr: string, strLen: number): string {

  if (fullStr?.length <= strLen || !fullStr) return fullStr;

  const SEPERATOR = '...';

  const sepLen = SEPERATOR.length;
  const charsToShow = strLen - sepLen;

  const frontChars = Math.ceil(charsToShow/2);
  const backChars = Math.floor(charsToShow/2);

  return `${fullStr.substr(0, frontChars)}${SEPERATOR}${fullStr.substr(fullStr.length - backChars)}`;
};