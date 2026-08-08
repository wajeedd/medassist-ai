import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  HeartPulse,
  ShieldPlus,
  Pill,
  Ruler,
  Weight,
} from "lucide-react";

import AnimatedModal from "../common/AnimatedModal";

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border">

      <div className="flex items-center gap-2 mb-2 text-blue-600">

        {icon}

        <span className="font-semibold">
          {title}
        </span>

      </div>

      <p className="text-slate-700">
        {value || "-"}
      </p>

    </div>
  );
}

function PatientDetailsModal({
  patient,
  isOpen,
  onClose,
}) {

  if (!patient) return null;

  return (

    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="👤 Patient Details"
      maxWidth="max-w-6xl"
    >

      {/* Header */}

      <div className="flex items-center gap-5 mb-8">

        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">

          {patient.first_name?.charAt(0)}
          {patient.last_name?.charAt(0)}

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-800">

            {patient.first_name} {patient.last_name}

          </h2>

          <p className="text-gray-500">

            {patient.city}, {patient.state}

          </p>

        </div>

      </div>

      {/* Personal Information */}

      <h3 className="text-xl font-bold mb-4">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

        <InfoCard
          icon={<User size={18} />}
          title="Gender"
          value={patient.gender}
        />

        <InfoCard
          icon={<Droplets size={18} />}
          title="Blood Group"
          value={patient.blood_group}
        />

        <InfoCard
          icon={<Calendar size={18} />}
          title="Date of Birth"
          value={patient.date_of_birth}
        />

        <InfoCard
          icon={<Phone size={18} />}
          title="Phone"
          value={patient.phone}
        />

        <InfoCard
          icon={<Mail size={18} />}
          title="Email"
          value={patient.email}
        />

        <InfoCard
          icon={<MapPin size={18} />}
          title="Address"
          value={`${patient.address}, ${patient.city}, ${patient.state}, ${patient.country}`}
        />

      </div>

      {/* Emergency */}

      <h3 className="text-xl font-bold mb-4">
        Emergency Contact
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        <InfoCard
          icon={<ShieldPlus size={18} />}
          title="Name"
          value={patient.emergency_contact_name}
        />

        <InfoCard
          icon={<User size={18} />}
          title="Relationship"
          value={patient.emergency_contact_relationship}
        />

        <InfoCard
          icon={<Phone size={18} />}
          title="Phone"
          value={patient.emergency_contact_phone}
        />

      </div>

      {/* Medical */}

      <h3 className="text-xl font-bold mb-4">
        Medical Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        <InfoCard
          icon={<Ruler size={18} />}
          title="Height"
          value={patient.height_cm ? `${patient.height_cm} cm` : "-"}
        />

        <InfoCard
          icon={<Weight size={18} />}
          title="Weight"
          value={patient.weight_kg ? `${patient.weight_kg} kg` : "-"}
        />

        <InfoCard
          icon={<HeartPulse size={18} />}
          title="Allergies"
          value={patient.allergies}
        />

        <InfoCard
          icon={<HeartPulse size={18} />}
          title="Medical Conditions"
          value={patient.medical_conditions}
        />

        <div className="lg:col-span-2">

          <InfoCard
            icon={<Pill size={18} />}
            title="Current Medications"
            value={patient.current_medications}
          />

        </div>

      </div>

    </AnimatedModal>

  );

}

export default PatientDetailsModal;