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

export function copyToClipboard(address: string): void {
  navigator.clipboard.writeText(address);
}