import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className='flex flex-col gap-6 p-10 sm:p-20 lg:px-10 max-w-6xl mx-auto'>
        <h1 className='text-slate-800 font-bold text-4xl sm:text-5xl md:text-6xl leading-tight'>
          Discover Your <span className='text-blue-700'>Perfect</span> Space
        </h1>
        <p className='text-gray-600 text-sm sm:text-base max-w-2xl'>
          Welcome to Prsar Group of Estate — your go-to platform for finding the perfect
          place to live. Browse our curated collection of properties for sale and rent.
        </p>
        <Link
          to='/search'
          className='w-fit bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-800 transition'
        >
          Let's get started
        </Link>
      </div>

      {/* Swiper */}
      <div className='relative max-w-6xl mx-auto px-4'>
        <Swiper navigation className='rounded-lg overflow-hidden'>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className='relative h-[400px] sm:h-[500px] w-full bg-cover bg-center'
                style={{
                  backgroundImage: `url(${listing.imageUrls[0]})`,
                }}
              >
                <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-2xl font-semibold'>
                  {listing.name}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Section */}
      <div className='max-w-6xl mx-auto px-4 py-10 space-y-12'>
        {/* Offers */}
        {offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-800'>Recent Offers</h2>
              <Link
                to='/search?offer=true'
                className='text-blue-700 text-sm hover:underline'
              >
                Show more offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-800'>
                Homes for Rent
              </h2>
              <Link
                to='/search?type=rent'
                className='text-blue-700 text-sm hover:underline'
              >
                Show more for rent
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-800'>
                Homes for Sale
              </h2>
              <Link
                to='/search?type=sale'
                className='text-blue-700 text-sm hover:underline'
              >
                Show more for sale
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
