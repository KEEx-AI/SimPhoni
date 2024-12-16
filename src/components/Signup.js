import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './Auth.css';

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: emailRef.current.value,
        createdAt: serverTimestamp()
      });
      navigate('/');
    } catch (err) {
      console.error("Error signing up: ", err);
      setError('Failed to create an account');
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" ref={emailRef} required />
        <label>Password</label>
        <input type="password" ref={passwordRef} required />
        <label>Password Confirmation</label>
        <input type="password" ref={passwordConfirmRef} required />
        <button disabled={loading} type="submit">Sign Up</button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}

export default Signup;
