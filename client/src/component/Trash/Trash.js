import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ConfirmDelete from "./ConfirmDelete";
import MailListItems from "../Mailbox/MailListItems";
import Selector from "../Mailbox/Selector";
import LoadingSpinner from "../UI/LoadingSpinner";
import EmptyMessage from "../UI/EmptyMessage";
import { moveFromInbox, moveFromSentbox, emptyTrash } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import useUnselect from "../../hooks/useUnselect";
import { config } from "../../config";

const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const senderMail = email.replace(/[.]/g, "");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);

  const filteredMails = mails.filter((mail) => mail.trashed);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const url1 = `${config.apiUrl}/emails`;
  const url2 = `${config.apiUrl}/sent-emails/${senderMail}`;

  const onRestoreHandler = async () => {
    try {
      /*
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            mail.sender === email
              ? `${url2}/${mail.id}.json`
              : `${url1}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: false,
            }
          )
        );

      await Promise.all(updatedPromises);

      dispatch(moveFromInbox({ move: "toInbox", email: email }));
      dispatch(moveFromSentbox({ move: "toSentbox", email: email }));
      */
      dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const emptyTrashHandler = async () => {
    /*
    try {
      const updatedPromises = filteredMails.map((mail) =>
        axios.delete(
          mail.sender === email
            ? `${url2}/${mail.id}.json`
            : `${url1}/${mail.id}.json`
        )
      );
      await Promise.all(updatedPromises);

      dispatch(emptyTrash());
      setShow(false);
      dispatch(
        showNotification({
          message: "Trash is cleared",
          variant: "success",
        })
      );
    } catch (error) {
      const {data} = error.response;
      console.log(data.error.message);
    }
    */
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
    setShow(false);
  };
useUnselect(dispatch)
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
