import { json } from '@codemirror/lang-json';
import { Button } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { Context } from '../panes/Request';

const HttpRawBody = ({ data }) => {
  const rawBodyParameters = useRef(null);

  const [rawParamsBody, setRawParamsBody] = useState(``);

  useEffect(() => {
    console.log({ data });
    setRawParamsBody(JSON.stringify(data));
  }, [data]);

  useCodeMirror({
    container: rawBodyParameters.current,
    value: rawParamsBody,
    height: '300px',
    extensions: [json()],
  });
  const prettifyRequestBody = () => {
    console.log(rawParamsBody, 'rawParamsBody');
    const jsonObj = JSON.parse(rawParamsBody);
    console.log(jsonObj, 'jsonObj');
    setRawParamsBody(JSON.stringify(jsonObj, null, 2));
  };

  const context = useContext(Context);
  // const context = useContext(Context)
  const user = context.state.user;
  const params = context.state.params;
  const handleName = (e) => {
    context.dispatch({ type: 'name', value: 'zt' });
  };

  return (
    <div>
      <Button onClick={() => prettifyRequestBody()}>变好看{user.name}</Button>
      <Button onClick={() => handleName('')}>change</Button>
      <div ref={rawBodyParameters}></div>
    </div>
  );
};

export default HttpRawBody;
