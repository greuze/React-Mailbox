import { Modal, Button } from "react-bootstrap";

const ConfirmDelete = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      centered
    >
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Confirmar borrar mensajes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border-0">
        ¡Esta acción borrará todos los mensajes permanentemente!
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="dark"
          className="rounded-pill border-0 bg-gradient shadow "
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="info"
          className="px-4 border-0 shadow bg-gradient  rounded-pill"
          onClick={props.emptyTrashHandler}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDelete;
