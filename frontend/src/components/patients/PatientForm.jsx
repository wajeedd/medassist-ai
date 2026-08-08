function PatientForm({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Patient",
}) {
  return (
    <form onSubmit={handleSubmit}>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Personal Information */}

        <div>
          <label className="block mb-2 font-medium">
            First Name *
          </label>

          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Last Name *
          </label>

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Date of Birth *
          </label>

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Gender *
          </label>

          <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="w-full border rounded-lg p-3"
  required
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>
</select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Blood Group
          </label>

          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Contact */}

        <div>
          <label className="block mb-2 font-medium">
            Phone *
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Address *
          </label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            City *
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            State *
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Country *
          </label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Postal Code *
          </label>

          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

      </div>

      <hr className="my-8"/>

      <h2 className="text-xl font-semibold mb-5">
        Emergency Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <input
          type="text"
          name="emergency_contact_name"
          placeholder="Contact Name"
          value={formData.emergency_contact_name}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="emergency_contact_relationship"
          placeholder="Relationship"
          value={formData.emergency_contact_relationship}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="emergency_contact_phone"
          placeholder="Phone"
          value={formData.emergency_contact_phone}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

      </div>

      <hr className="my-8"/>

      <h2 className="text-xl font-semibold mb-5">
        Medical Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <input
          type="number"
          step="0.1"
          name="height_cm"
          placeholder="Height (cm)"
          value={formData.height_cm}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          step="0.1"
          name="weight_kg"
          placeholder="Weight (kg)"
          value={formData.weight_kg}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <textarea
          name="allergies"
          placeholder="Allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <textarea
          name="medical_conditions"
          placeholder="Medical Conditions"
          value={formData.medical_conditions}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <textarea
          name="current_medications"
          placeholder="Current Medications"
          value={formData.current_medications}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

      </div>

      <div className="flex justify-end mt-10">

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
        >
          {loading ? "Saving..." : submitText}
        </button>

      </div>

    </form>
  );
}

export default PatientForm;