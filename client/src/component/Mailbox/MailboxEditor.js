import { useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { showNotification } from "../../store/authSlice";

const MailboxEditor = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const dispatch = useDispatch();
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onSubmitHandler = async (e) => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  return (
    <div className="p-3 mt-5 mt-lg-0">
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Para</InputGroup.Text>
        <Form.Control
          type="email"
          placeholder="nombre@mail.test"
          ref={toRef}
          required
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon2">Asunto</InputGroup.Text>
        <Form.Control type="text" placeholder="" ref={subjectRef} required />
      </InputGroup>
      <Form.Group className="mb-3" controlId="textEditor">
        <Editor
          toolbarClassName="py-3 border-bottom bg-light"
          wrapperClassName="card mt-3"
          editorClassName="card-body pt-0"
          editorStyle={{ minHeight: "15rem" }}
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
        />
      </Form.Group>
      <div>
        <Button
          type="submit"
          variant="danger"
          className="bg-gradient shadow rounded-0 px-4"
          onClick={onSubmitHandler}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default MailboxEditor;
