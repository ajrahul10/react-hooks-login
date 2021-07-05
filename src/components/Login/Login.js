import React, { useState, useEffect, useReducer, useContext } from 'react';

import AuthContext from '../../store/user-context';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input'

const emailReducer = (state, action) => {
  if (action.type === 'EMAIL_CHANGE') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'EMAIL_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
}

const passReducer = (state, action) => {
  if (action.type === 'PASS_CHANGE') {
    return { value: action.val, isValid: action.val.length > 6 };
  }
  if (action.type === 'PASS_BLUR') {
    return { value: state.value, isValid: state.value.length > 6 };
  }
  return { value: '', isValid: false };
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailEntered, emailDispatch] = useReducer(emailReducer,
    { value: '', isValid: null });

  const [passEntered, passDispatch] = useReducer(passReducer,
    { value: '', isValid: null });

  const { isValid: emailIsValid } = emailEntered;
  const { isValid: passIsValid } = passEntered;

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const formValidityTimout = setTimeout(() => {
      console.log('Checking form validity!!');
      setFormIsValid(
        emailIsValid && passIsValid
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(formValidityTimout);
    }
  }, [emailIsValid, passIsValid])

  const emailChangeHandler = (event) => {
    emailDispatch({ type: 'EMAIL_CHANGE', val: event.target.value });

    // setFormIsValid(
    //   event.target.value.includes('@') && passEntered.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    passDispatch({ type: 'PASS_CHANGE', val: event.target.value });

    // setFormIsValid(
    //   emailEntered.isValid && event.target.value.length > 6
    // );
  };

  const validateEmailHandler = () => {
    emailDispatch({ type: 'EMAIL_BLUR' });
  };

  const validatePasswordHandler = () => {
    passDispatch({ type: 'PASS_BLUR' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailEntered.value, passEntered.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="E-mail"
          type="email"
          isValid={emailIsValid}
          value={emailEntered.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          label="Password" 
          type="password" 
          isValid={passIsValid}
          value={passEntered.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
