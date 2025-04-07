import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 max-w-xl mx-auto mt-6">
          <div className="text-gray-800 text-lg">
            <p>
              Contact{' '}
              <span className="font-semibold text-blue-600">
                {landlord.username}
              </span>{' '}
              regarding{' '}
              <span className="font-semibold text-blue-600">
                {listing.name.toLowerCase()}
              </span>
            </p>
          </div>

          <textarea
            name="message"
            id="message"
            rows="4"
            value={message}
            onChange={onChange}
            placeholder="Type your message here..."
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-blue-600 text-white text-center py-3 px-5 rounded-lg uppercase tracking-wide hover:bg-blue-700 transition"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
