import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const uploadPromises = files.map((file) => storeImage(file));

      Promise.all(uploadPromises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...urls],
          }));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images per listing');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (type === 'number' || type === 'text' || type === 'textarea') {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }

    if (+formData.discountPrice >= +formData.regularPrice) {
      return setError('Discount price must be lower than regular price');
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Options */}
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((option) => (
              <label key={option} className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  id={option}
                  className='w-5 h-5'
                  checked={
                    option === 'sale' || option === 'rent'
                      ? formData.type === option
                      : formData[option]
                  }
                  onChange={handleChange}
                />
                <span className='capitalize'>{option === 'sale' ? 'Sell' : option}</span>
              </label>
            ))}
          </div>

          {/* Beds & Baths */}
          <div className='flex flex-wrap gap-6'>
            {['bedrooms', 'bathrooms'].map((field) => (
              <div key={field} className='flex items-center gap-2'>
                <input
                  type='number'
                  id={field}
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData[field]}
                />
                <p>{field === 'bedrooms' ? 'Beds' : 'Baths'}</p>
              </div>
            ))}

            {/* Regular Price */}
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
              </div>
            </div>

            {/* Discount Price */}
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError}</p>

          {/* Uploaded Images Preview */}
          {formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border items-center'>
              <img src={url} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
