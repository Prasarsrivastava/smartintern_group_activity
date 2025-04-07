import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='min-h-screen bg-gray-50'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl text-red-500'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Image Slider */}
          <Swiper navigation className='w-full'>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[450px] sm:h-[550px] w-full bg-center bg-cover'
                  style={{
                    backgroundImage: `url(${url})`,
                  }}
                >
                  <div className='w-full h-full bg-black/30'></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share button */}
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[4%] z-10 rounded-md bg-white text-green-700 shadow-md px-3 py-2'>
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6 mb-12 space-y-6'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-3xl font-bold text-slate-800'>
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </h1>

              <p className='flex items-center gap-2 text-slate-600 text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>

              <div className='flex flex-wrap gap-3 mt-3'>
                <span className='px-3 py-1 rounded-full text-white text-sm font-semibold bg-blue-700'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {listing.offer && (
                  <span className='px-3 py-1 rounded-full bg-green-700 text-white text-sm font-semibold'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className='text-slate-700 leading-relaxed'>
                <span className='font-semibold text-slate-800'>Description: </span>
                {listing.description}
              </p>
            </div>

            <ul className='flex flex-wrap gap-6 text-green-900 font-semibold text-sm'>
              <li className='flex items-center gap-1'>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className='flex items-center gap-1'>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className='flex items-center gap-1'>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking Spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1'>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* Contact Section */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-blue-700 text-white px-4 py-3 rounded-lg text-sm uppercase hover:bg-blue-800 transition w-full sm:w-fit'
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
