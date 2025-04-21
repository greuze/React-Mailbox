import { Button, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Selector from "../Mailbox/Selector";
import LoadingSpinner from "../UI/LoadingSpinner";
import EmptyMessage from "../UI/EmptyMessage";
import MailListItems from "../Mailbox/MailListItems";
import { moveFromStarred } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import useUnselect from "../../hooks/useUnselect";
import { config } from "../../config";

const Starred = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const senderMail = email.replace(/[.]/g, "");
  const starredMails = mails.filter((mail) => mail.starred && !mail.trashed);
  const isDeleteEnabled = starredMails.some((mail) => mail.isChecked);
  const url1 = `${config.apiUrl}/emails`;
  const url2 = `${config.apiUrl}/sent-emails/${senderMail}`;

  const onDeleteHandler = async () => {
    try {
      /*
      const updatedPromises = starredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            mail.sender === email
              ? `${url2}/${mail.id}.json`
              : `${url1}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);
      dispatch(moveFromStarred("toTrash"));
      */
      dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };
  useUnselect(dispatch)
  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <Selector filteredMails={starredMails} />
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
      ) : starredMails.length === 0 ? (
        <EmptyMessage message= "¡No tienes mensajes destacados!" />
      ) : (
        <ListGroup variant="flush">
          {starredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Starred;
