import GitHubButton from 'react-github-btn';

const AppGitHubStarButton = () => {
  return (
    <div style={{ height: '26px', paddingTop: '4px' }}>
      <GitHubButton
        data-text={'Star'}
        aria-label={'Star evaporator on GitHub'}
        data-show-count={true}
        title={'Star evaporator'}
        href='https://github.com/arextest/arex'
      />
    </div>
  );
};

export default AppGitHubStarButton;
