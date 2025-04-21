import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Selector from "../Mailbox/Selector";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import EmptyMessage from "../UI/EmptyMessage";
import { moveFromSentbox } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import useUnselect from "../../hooks/useUnselect";
import { config } from "../../config";

const Sent = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const sentMails = mails.filter(
    (mail) => !mail.trashed && mail.sender === email
  );
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const isDeleteEnabled = sentMails.some((mail) => mail.isChecked);
  const onDeleteHandler = async () => {
    try {
      /*
      const updatedPromises = sentMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `${config.apiUrl}/sent-emails/${senderMail}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);

      dispatch(moveFromSentbox({ move: "toTrash", email: email }));
      */
      dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };
  useUnselect(dispatch);
  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <Selector filteredMails={sentMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={!isDeleteEnabled}
            variant="danger"
            className="border-0 px-2"
            onClick={onDeleteHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash3"></i>
              <span className="">Borrar</span>
            </p>
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : sentMails.length === 0 ? (
        <>
          <EmptyMessage
            message="¡No tienes mensajes enviados!"
            link={
              <>
                <Link to="/welcome/mailboxeditor">
                  <span>Send</span>
                </Link> {" "}
                one now!
              </>
            }
          />{" "}
        </>
      ) : (
        <ListGroup variant="flush">
          {sentMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Sent;
