const EnvironmentMenu = ({onSelect}) => {




  return <div onClick={()=>{
    onSelect({key:'1',node:'2'})
  }}>Environment</div>;
};

export default EnvironmentMenu;
