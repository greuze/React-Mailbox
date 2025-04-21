import { Form, Button, FloatingLabel, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import InputErrorMessage from "./InputErrorMessage";
import Notification from "../UI/Notification";
import { showNotification, setIsLoading, login } from "../../store/authSlice";
import useInput from "../../hooks/useInput";
import { config } from "../../config";

const SignUp = () => {
  const [
    enteredEmail,
    emailInputHandler,
    emailBlurHandler,
    emailHasError,
  ] = useInput((email) => email.includes("@"));
  const [
    enteredPassword,
    passwordInputHandler,
    passwordBlurHandler,
    passwordHasError,
  ] = useInput((password) => password.length > 7);

  const isLoading = useSelector((state) => state.auth.isLoading);
  const apiKey = useSelector((state) => state.auth.apiKey);
  const dispatch = useDispatch();
  const { message, variant } = useSelector((state) => state.auth.notification);
  const history = useHistory();

  const endPointUrl = `${config.apiUrl}/auth?key=${apiKey}`;

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      if (emailHasError || passwordHasError) return;
      dispatch(setIsLoading(true));

      const response = await axios.post(endPointUrl, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      const data = response.data;
      if (response.status === 200) {
        dispatch(login({ idToken: data.idToken, email: data.email }));
        history.replace("/welcome/inbox");
      }
    } catch (error) {
      const { data } = error.response;
      const { message } = data.error;
      dispatch(showNotification({ message: message, variant: "danger" }));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center min-vh-100 align-items-center">
        {message && (
          <div className="fixed-top p-0">
            {" "}
            <Notification message={message} variant={variant} />{" "}
          </div>
        )}
        <Col>
          <div className="text-center pb-4">
            <h3>
              Bienvenido a{" "}
              <span className="text-danger fst-italic">Mail Box Client </span>
            </h3>
            <p>Por favor, introduzca sus datos para continuar.</p>
          </div>
          <div
            style={{ maxWidth: "25rem" }}
            className="text-center bg-danger bg-gradient mx-auto rounded-top py-1"
          >
            <i className="bi bi-envelope-at-fill fs-1 text-light"></i>
          </div>
          <Form
            onSubmit={onSubmitHandler}
            className="p-4 shadow-lg mx-auto "
            style={{ maxWidth: "25rem" }}
          >
            <FloatingLabel
              controlId="floatingInput"
              label="Dirección de e-mail"
              className="mb-3"
            >
              <Form.Control
                className={`border-0 border-bottom ${
                  emailHasError ? "border-danger" : ""
                } rounded-0`}
                type="email"
                placeholder="nombre@mail.test"
                onChange={emailInputHandler}
                onBlur={emailBlurHandler}
                value={enteredEmail}
                required
              />
              {emailHasError && (
                <InputErrorMessage message="¡Por favor, introduce un e-mail válido!" />
              )}
            </FloatingLabel>

            <FloatingLabel
              className="mb-3"
              controlId="floatingPassword"
              label="Contraseña"
            >
              <Form.Control
                className={`border-0 ${
                  passwordHasError ? "border-danger" : ""
                } border-bottom rounded-0`}
                type="password"
                placeholder="Contraseña"
                onBlur={passwordBlurHandler}
                onChange={passwordInputHandler}
                value={enteredPassword}
                required
              />
              {passwordHasError && (
                <InputErrorMessage message="¡La contraseña es demasiado corta!" />
              )}
            </FloatingLabel>
            <div className="text-center mt-4">
                <Button
                  type="submit"
                  className={`w-100 mt-2 bg-danger ${
                    isLoading ? "bg-gradient" : ""
                  }  rounded-0 border-0 text-light fw-bold`}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
