import AppPaneLayout from "../components/app/PaneLayout";
import {Allotment} from "allotment";
import {Button, Checkbox, styled} from "@nextui-org/react";
// import {Button,} from "antd";
// import useTheme from "antd/es/config-provider/hooks/useTheme";
// import useTheme from "antd/es/config-provider/hooks/useTheme";

const Button1 = styled('button', {
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',
  fontSize: '13px',
  border: '0',
});

const MainBox = () => {
  // useTheme()
  // createTheme()
  return <div style={{height:'400px'}}>
    <Allotment>
      <Allotment.Pane minSize={200}>
        <div>
          <Button>按钮</Button>
          <Button1>按钮2</Button1>
        </div>
      </Allotment.Pane>
      <Allotment.Pane snap>
        <Checkbox.Group
          color="secondary"
          defaultValue={["buenos-aires"]}
          label="Select cities"
        >
          <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
          <Checkbox value="sydney">Sydney</Checkbox>
          <Checkbox value="london">London</Checkbox>
          <Checkbox value="tokyo">Tokyo</Checkbox>
        </Checkbox.Group>
      </Allotment.Pane>
    </Allotment>
    {/*<AppPaneLayout></AppPaneLayout>*/}
  </div>
}

export default MainBox
