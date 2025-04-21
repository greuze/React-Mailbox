import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import { moveToTrash, deleteForever } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { config } from "../../config";

const Message = () => {
  const { messageId } = useParams();
  const location = useLocation();
  const mails = useSelector((state) => state.mail.mails);
  const mail = mails.find((mail) => mail.id === messageId);
  const history = useHistory();
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const { fetchData: modifyMail } = useAxiosFetch();
  let url;

  if (mails.length > 0) {
    url =
      mail.sender === email
        ? `${config.apiUrl}/sent-emails/${senderMail}/${mail.id}.json`
        : `${config.apiUrl}/emails/${mail.id}.json`;
  }

  const moveToTrashHandler = () => {
    /*
    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(moveToTrash(messageId));
        dispatch(
          showNotification({ message: "Moved to trash!", variant: "success" })
        );
        history.replace(
          location.pathname === `/welcome/inbox/${mail.id}`
            ? "/welcome/inbox"
            : location.pathname === `/welcome/trash/${mail.id}`
            ? "/welcome/trash"
            : location.pathname === `/welcome/sent/${mail.id}`
            ? "/welcome/sent"
            : "/welcome/starred"
        );
      }
    };

    modifyMail(
      url,
      "PUT",
      {
        ...mail,
        trashed: true,
      },
      onSuccess
    );
    */
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  const deleteForeverHandler = () => {
    /*
    dispatch(deleteForever({ id: messageId }));
    history.replace("/welcome/trash");
    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Mail deleted forever",
            variant: "success",
          })
        );
      }
    };

    modifyMail(url, "DELETE", null, onSuccess);
    */
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  const onBackHandler = () => {
    history.replace(
      location.pathname === `/welcome/inbox/${mail.id}`
        ? "/welcome/inbox"
        : location.pathname === `/welcome/trash/${mail.id}`
        ? "/welcome/trash"
        : location.pathname === `/welcome/sent/${mail.id}`
        ? "/welcome/sent"
        : "/welcome/starred"
    );
  };
  const dispatch = useDispatch();

  if (mails.length === 0) {
    return (
      <Container className="h-100">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  const dateFormat = new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <>
      <div className="border-bottom py-2 px-1 d-flex align-items-center mt-5 mt-lg-0">
        <p
          className="m-0"
          onClick={onBackHandler}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-arrow-left pe-2"></i>
          <span>Back</span>
        </p>

        {location.pathname !== `/welcome/trash/${messageId}` ? (
          <Button
            variant="danger"
            className="px-2 border-0 ms-auto mx-lg-auto"
            onClick={moveToTrashHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash3"></i>
              <span className="">Borrar</span>
            </p>
          </Button>
        ) : (
          <Button
            variant="danger"
            className="px-2 border-0 ms-auto mx-lg-auto"
            onClick={deleteForeverHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash3"></i>
              <span className="">Borrar para siempre</span>
            </p>
          </Button>
        )}
      </div>
      <div style={{ maxHeight: "80vh" }} className="overflow-auto">
        <div className="px-3">
          <div className="pt-3">
            <span className="fw-bold">De: </span>
            <span>{mail.sender}</span>
          </div>
          <div className="pt-2">
            <span className="fw-bold">Para: </span>
            <span>{mail.recipient}</span>
          </div>
          <div className="pt-2">
            <span className="fw-bold">Fecha: </span>
            <span>{dateFormat.format(new Date(mail.timestamp))}</span>
          </div>
          <div className="fw-bold pt-3">
            <span>{mail.subject}</span>
          </div>
          <div className="mt-2 bg-light mx-lg-auto">
            <p>{mail.emailContent}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
