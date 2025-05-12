import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { addToInbox, clearInbox } from "./store/mailSlice";
import useAxiosFetch from "./hooks/useAxiosFetch";
import { config } from "./config";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);
  const mails = useSelector((state) => state.mail.mails);

  const { fetchData: fetchMails } = useAxiosFetch();
  const dispatch = useDispatch();

  useEffect(() => {
    const onSuccess = (response) => {
      const mails = response?.data.map((mail) => ({
        ...mail,
        isChecked: false
      }));

      dispatch(addToInbox(mails));
    };

    if (recipientMail) {
      const url = `${config.apiUrl}/emails`;
      fetchMails(url, "POST", {email: recipientMail}, onSuccess);
    }

    return () => {
      dispatch(clearInbox());
    };
    // eslint-disable-next-line
  }, [recipientMail, dispatch, fetchMails]);

  useEffect(() => {
    const onSuccess = (response) => {
      const newMails = response?.data.map((mail) => ({
        ...mail,
        isChecked: false
      }));

      newMails.forEach((mail) => {
        if (!mails.some((email) => email.id === mail.id)) {
          dispatch(addToInbox([mail]));
        }
      });
    };

    const interval = setInterval(() => {
      if (recipientMail) {
        const url = `${config.apiUrl}/emails`;
        fetchMails(url, "POST", {email: recipientMail}, onSuccess);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchMails, recipientMail, mails, dispatch]);

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth">
        <SignUp />
      </Route>
      {isAuthenticated && (
        <Route path="/welcome">
          <Welcome />
        </Route>
      )}
      {!isAuthenticated ? (
        <Redirect from="*" to="/auth" />
      ) : (
        <Redirect from="*" to="/welcome/inbox" />
      )}
    </Switch>
  );
}

export default App;
