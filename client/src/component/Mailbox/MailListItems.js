import { useState } from "react";
import { ListGroup, Row, Col, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setChecked , setRead } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";

const MailListItems = (props) => {
  const { mail } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const onCheckHandler = () => {
    dispatch(setChecked({ id: mail.id, selector: "single" }));
  };

  const [isHovered, setIsHovered] = useState(false);
  const [starHovered, setStarHovered] = useState(false);

  const starMouseEnter = () => {
    setStarHovered(true);
  };
  const starMouseLeave = () => {
    setStarHovered(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const starClickHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

   dispatch(showNotification({ message: "¡Operación bloqueada por orden judicial!", variant: "danger" }));
  };

  const onClickHandler = () => {
    dispatch(setChecked({ id: null, selector: "none" }));
    dispatch(setRead({ id: mail.id }));
  };

  const dateFormat = new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit"
  });

  return (
    <ListGroup.Item
      as={Link}
      to={
        location.pathname === "/welcome/inbox"
          ? `/welcome/inbox/${mail.id}`
          : location.pathname === "/welcome/trash"
          ? `/welcome/trash/${mail.id}`
          : location.pathname === "/welcome/sent"
          ? `/welcome/sent/${mail.id}`
          : `/welcome/starred/${mail.id}`
      }
      className={`mb-1 py-2 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      } ${isHovered ? "shadow-sm" : ""}`}
      style={mail.hasRead ? {} : { fontWeight: "bold", backgroundColor: "#f8f9fa" }}
      onClick={onClickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        <Col lg="12">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={onCheckHandler}
                onClick={(e) => e.stopPropagation()}
              />
            </Form>

            <div>
              <i className={`bi ${mail.starred ? "bi-star-fill text-warning" : "bi-star"} px-1 ms-1 ${
                  starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                }`}
                onClick={starClickHandler}
                onMouseEnter={starMouseEnter}
                onMouseLeave={starMouseLeave}
              />
            </div>

            {mail.hasRead ? (<></>) : (
            <i className={`bi bi-record-fill text-primary`}></i>
            )}

            <div style={{wordBreak: "break-all"}}>{mail.sender}</div>
            <div style={{marginLeft: "auto"}}>{dateFormat.format(new Date(mail.timestamp))}</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="8" className="pt-1 pt-lg-0">
          <div>
            <span>{mail.subject}</span>
            <span className="ps-2" style={{fontStyle: 'italic'}}>{`${mail.emailContent.substring(0, 50)}...`}</span>
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailListItems;
