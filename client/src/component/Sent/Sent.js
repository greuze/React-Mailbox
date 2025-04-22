import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import Selector from "../Mailbox/Selector";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import EmptyMessage from "../UI/EmptyMessage";
import { showNotification } from "../../store/authSlice";
import useUnselect from "../../hooks/useUnselect";

const Sent = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const sentMails = mails.filter(
    (mail) => mail.sender === email && !mail.trashed?.includes(email)
  );
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const isDeleteEnabled = sentMails.some((mail) => mail.isChecked);
  const onDeleteHandler = async () => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
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
