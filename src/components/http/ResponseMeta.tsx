const HttpResponseMeta = ({ response }) => {
  return (
    <div>
      {response === null ? (
        <div></div>
      ) : (
        <>
          <div>{response.type === 'loading' ? <span>l</span> : null}</div>

          <div>
            {response.type === 'success' ? (
              <div>
                <span>{response.statusCode}</span>
                <span>{response.responseDuration}</span>
                <span>{response.responseSize}</span>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default HttpResponseMeta;
