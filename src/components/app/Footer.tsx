import { CheckCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import {css} from "@emotion/react";

const AppFooter = () => {
  return (
    <div css={css`height: 24px;background-color: white;border-top: 1px solid #EDEDED`}>
      <div>{/*left*/}</div>
      <div>
        {/*right*/}
        {window.__AREX_EXTENSION_INSTALLED__ ? (
          <div>
            <CheckCircleOutlined style={{ color: 'rgb(82, 196, 26)' }} />
            <span style={{ color: '#6b6b6b', marginLeft: '3px' }}>Browser Agent</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppFooter;
