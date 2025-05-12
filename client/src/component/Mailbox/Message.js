import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import { showNotification } from "../../store/authSlice";

const Message = () => {
  const { messageId } = useParams();
  const location = useLocation();
  const mails = useSelector((state) => state.mail.mails);
  const mail = mails.find((mail) => mail.id === messageId);
  const history = useHistory();

  const moveToTrashHandler = () => {
    dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  const deleteForeverHandler = () => {
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
    timeZone: "+02:00",
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
          <span>Atrás</span>
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
            <span>{mail.recipients.join(", ")}</span>
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
