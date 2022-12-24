import { useState } from 'react';

import WorkspaceInvite from './Invite';

const Workspace = () => {
  const [showModalInvite, setShowModalInvite] = useState(false);

  const displayModalInvite = (shouldDisplay: boolean) => {
    setShowModalInvite(shouldDisplay);
  };
  return (
    <div>
      <WorkspaceInvite
        show={showModalInvite}
        hideModal={() => {
          displayModalInvite(false);
        }}
      ></WorkspaceInvite>
    </div>
  );
};
export default Workspace;
