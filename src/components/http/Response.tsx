import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const response = {}
  return (
    <div>
      <HttpResponseMeta response={response} />
      <LensesResponseBodyRenderer response={response} />
    </div>
  );
};

export default HttpResponse;
