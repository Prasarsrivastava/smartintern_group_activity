import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6'>
        <h1 className='text-4xl font-bold text-center text-slate-800'>Sign In</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              placeholder='you@example.com'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='password' className='block mb-1 text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='********'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600'
              onChange={handleChange}
              required
            />
          </div>
          <button
            disabled={loading}
            className='w-full bg-slate-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition disabled:opacity-70'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <OAuth />
        </form>

        <div className='text-sm text-center text-gray-600'>
          Don't have an account?{' '}
          <Link to='/sign-up' className='text-blue-600 hover:underline'>
            Sign Up
          </Link>
        </div>

        {error && <p className='text-center text-red-500 text-sm'>{error}</p>}
      </div>
    </div>
  );
}
