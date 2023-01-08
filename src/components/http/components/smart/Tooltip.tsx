import { css } from '@emotion/react';
import { FC, useRef, useState } from 'react';

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
  const [maskOpen, setMaskOpen] = useState(false);
  return (
    <Portal>
      <div
        css={css`
          display: ${open || maskOpen ? 'block' : 'none'};
          left: ${left}px;
          top: ${top - contentHeight}px;
          position: absolute;
        `}
        onMouseOut={() => {
          setMaskOpen(false);
        }}
        onMouseOver={() => {
          setMaskOpen(true);
        }}
        ref={listHeight}
      >
        {content}
      </div>
    </Portal>
  );
};

export default SmartTooltip;
