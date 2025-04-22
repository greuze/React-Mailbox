import { setChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
import { SplitButton, Form, Dropdown } from "react-bootstrap";

const Selector = (props) => {
  const dispatch = useDispatch();
  const checked = props.filteredMails.some((mail) => mail.isChecked === false);

  const selectHandler = (select) => {
    dispatch(setChecked({ id: null, selector: select }));
  };

  return (
    <SplitButton
      variant={"light"}
      title={
        <Form>
          <Form.Check
            onChange={() => selectHandler("all")}
            checked={!checked && props.filteredMails.length > 0}
          />
        </Form>
      }
      className="p-0"
      disabled={props.filteredMails.length === 0}
    >
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("allMark")}
        eventKey="1"
      >
        Todos
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => selectHandler("none")}
        as={"button"}
        eventKey="2"
      >
        Ninguno
      </Dropdown.Item>
    </SplitButton>
  );
};

export default Selector;
