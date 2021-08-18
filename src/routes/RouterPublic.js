import { Fragment } from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import SignIn from '../views/public/SignIn.js';

const RouterPublic = (props) => {
  const { setUser } = props;

  return (
    <>
      <Switch>
        <Route exact path='/'>
          <SignIn setUser={setUser} />
        </Route>
        <Redirect to='/' />
      </Switch>
    </>
  );
};

export default RouterPublic;
