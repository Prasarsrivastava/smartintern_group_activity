<main className="p-4 max-w-5xl mx-auto">
  <h1 className="text-3xl font-bold text-center my-8">Update a Listing</h1>
  <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
    {/* LEFT SIDE FORM */}
    <div className="flex flex-col gap-6 flex-1 bg-white p-6 rounded-xl shadow-md border">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-gray-700">
          Listing Name
        </label>
        <input
          type="text"
          id="name"
          maxLength="62"
          minLength="10"
          required
          placeholder="Enter property name"
          className="border rounded-lg p-3"
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          required
          placeholder="Write a brief description"
          className="border rounded-lg p-3 h-28"
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          required
          placeholder="Enter property address"
          className="border rounded-lg p-3"
          onChange={handleChange}
          value={formData.address}
        />
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {[
          { id: 'sale', label: 'Sell', checked: formData.type === 'sale' },
          { id: 'rent', label: 'Rent', checked: formData.type === 'rent' },
          { id: 'parking', label: 'Parking', checked: formData.parking },
          { id: 'furnished', label: 'Furnished', checked: formData.furnished },
          { id: 'offer', label: 'Offer', checked: formData.offer },
        ].map((opt) => (
          <label key={opt.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={opt.id}
              checked={opt.checked}
              className="accent-slate-700"
              onChange={handleChange}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* NUMBERS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            min="1"
            max="10"
            required
            className="p-3 border rounded-lg w-full"
            onChange={handleChange}
            value={formData.bedrooms}
          />
        </div>
        <div>
          <label className="text-sm">Bathrooms</label>
          <input
            type="number"
            id="bathrooms"
            min="1"
            max="10"
            required
            className="p-3 border rounded-lg w-full"
            onChange={handleChange}
            value={formData.bathrooms}
          />
        </div>
        <div>
          <label className="text-sm">Regular Price</label>
          <input
            type="number"
            id="regularPrice"
            min="50"
            max="10000000"
            required
            className="p-3 border rounded-lg w-full"
            onChange={handleChange}
            value={formData.regularPrice}
          />
          {formData.type === 'rent' && (
            <p className="text-xs text-gray-500">($ / month)</p>
          )}
        </div>
        {formData.offer && (
          <div>
            <label className="text-sm">Discount Price</label>
            <input
              type="number"
              id="discountPrice"
              min="0"
              max="10000000"
              required
              className="p-3 border rounded-lg w-full"
              onChange={handleChange}
              value={formData.discountPrice}
            />
            {formData.type === 'rent' && (
              <p className="text-xs text-gray-500">($ / month)</p>
            )}
          </div>
        )}
      </div>
    </div>

    {/* RIGHT SIDE - IMAGES */}
    <div className="flex flex-col gap-4 flex-1 bg-white p-6 rounded-xl shadow-md border">
      <div>
        <p className="font-semibold text-gray-800">
          Property Images
          <span className="text-sm font-normal text-gray-500 ml-2">
            (max 6, first = cover)
          </span>
        </p>
        <div className="flex items-center gap-3 mt-2">
          <input
            onChange={(e) => {
              setFiles(e.target.files);
              e.target.value = null; // reset after upload
            }}
            type="file"
            id="images"
            accept="image/*"
            multiple
            className="p-2 border rounded w-full"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-70"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {imageUploadError && (
          <p className="text-sm text-red-600 mt-1">{imageUploadError}</p>
        )}
      </div>

      {formData.imageUrls.length > 0 &&
        formData.imageUrls.map((url, index) => (
          <div
            key={url}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <img
              src={url}
              alt="listing"
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))}

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full mt-4 bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-80"
      >
        {loading ? 'Updating...' : 'Update Listing'}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  </form>
</main>
