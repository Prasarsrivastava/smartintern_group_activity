export default function Profile() {
  // ... all your imports and hooks stay the same

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-slate-800">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className="rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-slate-300"
            />
            <p className="text-sm mt-2">
              {fileUploadError ? (
                <span className="text-red-600">
                  Upload failed (Image must be less than 2MB)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-600">{`Uploading ${filePerc}%...`}</span>
              ) : filePerc === 100 ? (
                <span className="text-green-600">Upload complete!</span>
              ) : (
                ''
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              id="username"
              defaultValue={currentUser.username}
              placeholder="Username"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="email"
              id="email"
              defaultValue={currentUser.email}
              placeholder="Email"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="password"
              id="password"
              placeholder="New Password"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full sm:col-span-2"
            />
          </div>

          <button
            disabled={loading}
            className="bg-indigo-600 text-white font-medium rounded-lg p-3 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <Link
            to="/create-listing"
            className="bg-green-600 text-white text-center font-medium rounded-lg p-3 hover:bg-green-700 transition"
          >
            Create New Listing
          </Link>
        </form>

        {/* Feedback */}
        <div className="mt-4 text-center">
          {error && <p className="text-red-600">{error}</p>}
          {updateSuccess && <p className="text-green-600">Profile updated successfully!</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6 text-sm text-red-600">
          <button onClick={handleDeleteUser} className="hover:underline">Delete Account</button>
          <button onClick={handleSignOut} className="hover:underline">Sign Out</button>
        </div>
      </div>

      {/* Show Listings Button */}
      <div className="mt-6">
        <button
          onClick={handleShowListings}
          className="w-full bg-slate-100 hover:bg-slate-200 rounded-lg p-3 text-slate-700 font-semibold"
        >
          Show My Listings
        </button>
        {showListingsError && (
          <p className="text-red-600 text-center mt-2">Could not load listings</p>
        )}
      </div>

      {/* Listings */}
      {userListings?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">My Listings</h2>
          <div className="space-y-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 mx-4 font-medium text-slate-800 hover:underline truncate"
                >
                  {listing.name}
                </Link>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-600 hover:underline text-sm">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
