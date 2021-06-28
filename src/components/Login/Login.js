import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

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
    props.onLogin(emailEntered.value, passEntered.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailEntered.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailEntered.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passEntered.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passEntered.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
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
