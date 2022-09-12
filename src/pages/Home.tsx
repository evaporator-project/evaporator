import { useMount, useRequest } from 'ahooks';
import axios from 'axios';

const Home = () => {
  const { run, loading } = useRequest(() => axios.get('/api/vi/health'), {
    manual: true,
    onSuccess(res) {
      console.log(res);
    },
  });
  useMount(() => {
    run();
  });
  return <div>Home</div>;
};

export default Home;
