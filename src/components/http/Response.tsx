import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';
import {requestUseStore} from "../../store/request";
import {useContext} from "react";
import {ColorContext} from "../panes/Request";

const HttpResponse = () => {
  const {store} = useContext(ColorContext)
  return (
    <div>
      <p>{store.response}11</p>
      <HttpResponseMeta response={store.response} />
      <LensesResponseBodyRenderer response={store.response} />
    </div>
  );
};

export default HttpResponse;
