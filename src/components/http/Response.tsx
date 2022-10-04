import { useContext, useMemo } from 'react';

// import { requestUseStore } from '../../store/request';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import { HttpContext } from '../panes/Request';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const { store } = useContext(HttpContext);
  const hasResponse = useMemo(
    () => store.response.type === 'success' || store.response.type === 'fail',
    [store.response],
  );
  const loading = useMemo(
    () => store.response.type === null || store.response.type === 'loading',
    [store.response],
  );

  return (
    <div>
      {/*<p>{store.response}11</p>*/}
      <HttpResponseMeta response={store.response} />
      {!loading && hasResponse ? <LensesResponseBodyRenderer response={store.response} /> : null}
    </div>
  );
};

export default HttpResponse;
