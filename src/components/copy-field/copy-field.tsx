import { Popover, Typography } from "@mui/material";
import { copyToClipboard } from "helpers";
import React from "react";
import { ReactElement } from "react";

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
    <>
    <Typography
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div className="cursor-pointer" onClick={handleCopied}>
        {children && children}
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
    </>
  );
}

export default CopyField;
