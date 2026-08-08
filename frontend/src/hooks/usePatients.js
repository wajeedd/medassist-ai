import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../services/patientService";

export default function usePatients() {

  const emptyForm = {
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
    height_cm: "",
    weight_kg: "",
    allergies: "",
    medical_conditions: "",
    current_medications: "",
  };

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      toast.error("Failed to load patients.");
      console.error(err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await loadPatients();
      setLoading(false);
    }

    init();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const fullName =
        `${patient.first_name} ${patient.last_name}`.toLowerCase();

      return (
        fullName.includes(search.toLowerCase()) ||
        patient.phone.includes(search) ||
        (patient.email || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [patients, search]);

  const stats = useMemo(() => {

    const males =
      patients.filter(p => p.gender === "male").length;

    const females =
      patients.filter(p => p.gender === "female").length;

    const bloodGroups = {};

    patients.forEach((p) => {

      if (!p.blood_group) return;

      bloodGroups[p.blood_group] =
        (bloodGroups[p.blood_group] || 0) + 1;

    });

    const blood =
      Object.keys(bloodGroups).length
        ? Object.keys(bloodGroups).reduce((a, b) =>
            bloodGroups[a] > bloodGroups[b] ? a : b
          )
        : "-";

    return {
      total: patients.length,
      males,
      females,
      blood,
    };

  }, [patients]);

  const addPatient = async () => {
    try {

      setSaving(true);

      await createPatient(formData);

      toast.success("Patient added successfully.");

      setFormData(emptyForm);

      await loadPatients();

      return true;

    } catch (err) {

      console.error(err);

      toast.error("Failed to add patient.");

      return false;

    } finally {

      setSaving(false);

    }
  };
  const editPatient = async (patientId) => {
  try {

    setSaving(true);

    await updatePatient(patientId, formData);

    toast.success("Patient updated successfully.");

    await loadPatients();

    return true;

  } catch (err) {

    console.error(err);

    toast.error("Failed to update patient.");

    return false;

  } finally {

    setSaving(false);

  }
};
    const removePatient = async (patientId) => {

  try {

    setSaving(true);

    await deletePatient(patientId);

    toast.success("Patient deleted successfully.");

    await loadPatients();

    return true;

  } catch (err) {

    console.error(err);

    toast.error("Failed to delete patient.");

    return false;

  } finally {

    setSaving(false);

  }

};


  return {

  patients,
  filteredPatients,

  loading,
  saving,

  stats,

  search,
  setSearch,

  formData,
  setFormData,

  emptyForm,

  loadPatients,

  addPatient,
  editPatient,

  removePatient,

};

}