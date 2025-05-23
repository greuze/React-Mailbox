import { ListGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MailListItems from "./MailListItems";
import LoadingSpinner from "../UI/LoadingSpinner";
import { showNotification } from "../../store/authSlice";
import Selector from "./Selector";
import useUnselect from "../../hooks/useUnselect";
import EmptyMessage from "../UI/EmptyMessage";

const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter(
    (mail) => mail.recipients.includes(email) && !mail.trashed?.includes(email)
  );

  const isDeleteEnabled = filteredMails.some((mail) => mail.isChecked);

  const onDeleteHandler = async () => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };
  useUnselect(dispatch)

  return (
    <div className="">
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <Selector filteredMails={filteredMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            variant="danger"
            className="px-2 border-0"
            disabled={!isDeleteEnabled}
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
        <div className="d-flex mt-5 pt-5 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        <EmptyMessage message = "¡Tu bandeja está vacía!"/>
      ) : (
        <ListGroup variant="flush" className="overflow-auto">
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Inbox;
