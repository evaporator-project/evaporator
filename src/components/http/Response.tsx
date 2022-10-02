import { useContext } from 'react';

import { requestUseStore } from '../../store/request';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import { ColorContext } from '../panes/Request';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const { store } = useContext(ColorContext);
  return (
    <div>
      {/*<p>{store.response}11</p>*/}
      <HttpResponseMeta response={store.response} />
      <LensesResponseBodyRenderer response={store.response} />
    </div>
  );
};

export default HttpResponse;
