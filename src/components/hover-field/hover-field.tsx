import { Popover, Typography } from "@mui/material";
import { truncateAddress } from "helpers";
import React, { ReactElement } from "react";

const HoverField: React.FC<{text: string, extraClass?: string, start?: ReactElement, end?: ReactElement, truncateLen?: number, copy?: boolean}> = ({ text, truncateLen = 10, extraClass, start, end })  => {

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (text.length > truncateLen) {
      setAnchorEl(event.currentTarget);
    }
  };

  const truncateText = truncateAddress(text, truncateLen);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
    <Typography
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div className={"cursor-pointer flex " + extraClass} >
        {start && start}
        <div className="self-start">{truncateText}</div>
        {end && end}
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
        <Typography sx={{ p: 1 }}>{text}</Typography>
      </Popover>
    </div>
  );
}

export default HoverField;