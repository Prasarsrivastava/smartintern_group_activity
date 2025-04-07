import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6'>
        <h1 className='text-4xl font-bold text-center text-slate-800'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='username' className='block mb-1 text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              type='text'
              id='username'
              placeholder='johndoe'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600'
              onChange={handleChange}
              required
            />
          </div>
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>

        <div className='text-sm text-center text-gray-600'>
          Already have an account?{' '}
          <Link to='/sign-in' className='text-blue-600 hover:underline'>
            Sign In
          </Link>
        </div>

        {error && <p className='text-center text-red-500 text-sm'>{error}</p>}
      </div>
    </div>
  );
}
