import WelcomeSvg from '../../assets/img/sss.svg'
import logoSvg from '../../assets/img/logo.svg'
import './index.less'
import { Button } from 'antd'
import { useMount } from 'ahooks'
// import { BaseService } from '../../services/BaseService'
import React,{useEffect, useState} from 'react'
import request from "../../services/request";

const Welcome = () => {
  const [baseInfo, setBaseInfo] = useState({
    thAppType: '',
    thAppClientId: '',
    thAppRedirectUri: '',
    thAppUri: '',
  })
  // 重定向去第三方鉴权
  function redirectToThAuth() {
    // let redirect_uri = ''
    // let ClientId = ''
    // if (window.location.hostname.includes('127.0.0.1')) {
    //   redirect_uri = 'http://127.0.0.1:8000/login'
    //   ClientId =
    //     'a706dedb740074edb802e8c60e418b74fc95c8fbef48316e501de50028c6462a'
    // } else {
    //   redirect_uri = 'http://canyon.rico.org.cn/login'
    //   ClientId =
    //     'ffc3eef394876ab159d1b6e74799dc160825280ec6e19a7d234b6bf057db65c8'
    // }
    window.location.href = `${baseInfo.thAppUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${baseInfo.thAppClientId}&redirect_uri=${baseInfo.thAppRedirectUri}`
  }

  useMount(() => {
    request({method:'GET',url:'/api/base'}).then(res=>{
      console.log(res)
      setBaseInfo(res)
    })
  })

    useEffect(()=>{
        console.log(`${baseInfo.thAppUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${baseInfo.thAppClientId}&redirect_uri=${baseInfo.thAppRedirectUri}`)
    },[baseInfo])

  return (
    <div className={'welcome'}>
      <div className={'left-box'}>
        <div className="login-form">
          <div className="logo">
            <img src={logoSvg} alt="" />
            <span>CANYON</span>
          </div>
          <h1 className={'title'}>
            Hello，
            <br />
            Welcome to Canyon。
          </h1>
          <p className={'desc'}>You will be redirected to your source control management system to authenticate.</p>
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
        <div
          className={'img-wrap'}
          style={{ backgroundImage: `url(${WelcomeSvg})` }}
        >
          {/*<img src={WelcomeSvg}/>*/}
        </div>
      </div>
    </div>
  )
}

export default Welcome
