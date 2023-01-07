import { css } from '@emotion/react';
import { FC, useEffect, useRef, useState } from 'react';

import { Portal } from './Portal';
interface TooltipProps {
  content: any;
  open: boolean;
  left: number;
  top: number;
  contentHeight: number;
}
const SmartTooltip: FC<TooltipProps> = ({
  content,
  open,
  left,
  top,
  contentHeight,
}) => {
  const listHeight = useRef(null);
  const [bentiOpen, setBentiOpen] = useState(false);
  return (
    <Portal>
      <div
        css={css`
          display: ${open || bentiOpen ? 'block' : 'none'};
          left: ${left}px;
          top: ${top - contentHeight}px;
          position: absolute;
        `}
        onMouseOut={() => {
          setBentiOpen(false);
        }}
        onMouseOver={() => {
          setBentiOpen(true);
        }}
        ref={listHeight}
      >
        {content}
      </div>
    </Portal>
  );
};

export default SmartTooltip;
