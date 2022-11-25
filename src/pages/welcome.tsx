import { useMount } from 'ahooks';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

// import logoSvg from '../assets/img/logo.svg';
// import WelcomeSvg from '../assets/img/sss.svg';
import request from '../services/request';

const Welcome = () => {
  const [baseInfo, setBaseInfo] = useState({
    thAppType: '',
    thAppClientId: '',
    thAppRedirectUri: '',
    thAppUri: '',
  });
  // 重定向去第三方鉴权
  function redirectToThAuth() {
    window.location.href = `${baseInfo.thAppUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${baseInfo.thAppClientId}&redirect_uri=${baseInfo.thAppRedirectUri}`;
  }

  useMount(() => {
    request({ method: 'GET', url: '/api/base' }).then((res: any) => {
      setBaseInfo(res);
    });
  });

  useEffect(() => {
    console.log(
      `${baseInfo.thAppUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${baseInfo.thAppClientId}&redirect_uri=${baseInfo.thAppRedirectUri}`,
    );
  }, [baseInfo]);

  return (
    <div className={'welcome'}>
      <div className={'left-box'}>
        <div className='login-form'>
          <div className='logo'>
            {/*<img src={logoSvg} alt='' />*/}
            <span>CANYON</span>
          </div>
          <h1 className={'title'}>
            Hello，
            <br />
            Welcome to Canyon。
          </h1>
          <p className={'desc'}>
            You will be redirected to your source control management system to authenticate.
          </p>
          <Button
            type={'primary'}
            style={{ width: '100%' }}
            size={'large'}
            onClick={() => redirectToThAuth()}
          >
            Continue
          </Button>
        </div>
      </div>
      <div className={'right-box'}>
        {/*<div className={'img-wrap'} style={{ backgroundImage: `url(${WelcomeSvg})` }}>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Welcome;