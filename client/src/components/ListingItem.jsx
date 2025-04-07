import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow rounded-2xl w-full sm:w-[330px] overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <p className="truncate text-lg font-semibold text-gray-800">
            {listing.name}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MdLocationOn className="text-green-600" />
            <p className="truncate">{listing.address}</p>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2">
            {listing.description}
          </p>

          <p className="text-blue-600 font-semibold text-base mt-1">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div className="flex gap-4 text-xs text-slate-700 font-semibold">
            <span>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </span>
            <span>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
