import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    }
    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) =>
      urlParams.set(key, value)
    );
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    setShowMore(data.length >= 9);
    setListings((prev) => [...prev, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row bg-gray-50 min-h-screen'>
      {/* Sidebar */}
      <aside className='w-full md:w-80 border-r border-gray-200 p-6 bg-white shadow-sm'>
        <h2 className='text-xl font-bold text-slate-800 mb-6'>Filter Listings</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* Search Term */}
          <div>
            <label htmlFor='searchTerm' className='block font-semibold mb-1'>Search</label>
            <input
              id='searchTerm'
              type='text'
              placeholder='e.g. 2BHK in Mumbai'
              className='w-full p-3 border rounded-md'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div>
            <p className='font-semibold mb-2'>Listing Type</p>
            <div className='flex flex-col gap-2'>
              {['all', 'rent', 'sale'].map((type) => (
                <label key={type} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id={type}
                    checked={sidebardata.type === type}
                    onChange={handleChange}
                    className='w-4 h-4'
                  />
                  <span className='capitalize'>{type === 'all' ? 'Rent & Sale' : type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Offer */}
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='offer'
              checked={sidebardata.offer}
              onChange={handleChange}
              className='w-4 h-4'
            />
            <label htmlFor='offer' className='font-semibold'>Offer Available</label>
          </div>

          {/* Amenities */}
          <div>
            <p className='font-semibold mb-2'>Amenities</p>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  checked={sidebardata.parking}
                  onChange={handleChange}
                  className='w-4 h-4'
                />
                <span>Parking</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  checked={sidebardata.furnished}
                  onChange={handleChange}
                  className='w-4 h-4'
                />
                <span>Furnished</span>
              </label>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor='sort_order' className='font-semibold mb-1 block'>Sort By</label>
            <select
              id='sort_order'
              onChange={handleChange}
              defaultValue='created_at_desc'
              className='w-full p-3 border rounded-md'
            >
              <option value='regularPrice_desc'>Price: High to Low</option>
              <option value='regularPrice_asc'>Price: Low to High</option>
              <option value='created_at_desc'>Newest Listings</option>
              <option value='created_at_asc'>Oldest Listings</option>
            </select>
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold uppercase'>
            Search
          </button>
        </form>
      </aside>

      {/* Results Section */}
      <main className='flex-1 p-6'>
        <h2 className='text-2xl font-bold text-slate-800 mb-4'>Listing Results</h2>

        {loading ? (
          <p className='text-center text-lg text-gray-600'>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className='text-center text-lg text-red-500'>No listings found!</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {showMore && !loading && (
          <div className='mt-6 text-center'>
            <button
              onClick={onShowMoreClick}
              className='text-blue-600 hover:underline font-semibold'
            >
              Show more listings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
