import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ConfirmDelete from "./ConfirmDelete";
import MailListItems from "../Mailbox/MailListItems";
import Selector from "../Mailbox/Selector";
import LoadingSpinner from "../UI/LoadingSpinner";
import EmptyMessage from "../UI/EmptyMessage";
import { showNotification } from "../../store/authSlice";
import useUnselect from "../../hooks/useUnselect";

const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);

  const filteredMails = mails.filter((mail) => mail.trashed?.includes(email));

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const onRestoreHandler = async () => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  const emptyTrashHandler = async () => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
    setShow(false);
  };

  useUnselect(dispatch);

  return (
    <>
      {
        <ConfirmDelete
          handleClose={handleClose}
          show={show}
          emptyTrashHandler={emptyTrashHandler}
        />
      }

      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <Selector filteredMails={filteredMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={filteredMails.length === 0}
            size="sm"
            variant="danger"
            className="border-0 me-3"
            onClick={handleShow}
          >
            Vaciar papelera
          </Button>
          <Button
            disabled={!isDeleteEnabled}
            size="sm"
            variant="danger"
            className="border-0 "
            onClick={onRestoreHandler}
          >
            Restaurar
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        <EmptyMessage message = "¡No hay mensajes en la papelera!"/>
      ) : (
        <ListGroup
          variant="flush"
          className="overflow-auto"
          // style={{ maxHeight: "85vh" }}
        >
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Trash;
