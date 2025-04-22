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

  const { fetchData: fetchMails } = useAxiosFetch();
  const dispatch = useDispatch();
  const url = `${config.apiUrl}/emails`;

    useEffect(() => {
    const onSuccess = (response) => {
      const mails = response?.data.map((mail) => ({
        ...mail,
        isChecked: false
      }));

      dispatch(addToInbox(mails));
    };

    if (recipientMail) {
      fetchMails(url, "POST", {email: recipientMail}, onSuccess);
    }

    return () => {
      dispatch(clearInbox());
    };
    // eslint-disable-next-line
  }, [recipientMail, dispatch, fetchMails]);

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
