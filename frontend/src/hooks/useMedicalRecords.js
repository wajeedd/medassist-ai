import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../services/medicalRecordService";

import { getPatients } from "../services/patientService";

export default function useMedicalRecords() {
  // --------------------------------
  // Empty Form
  // --------------------------------

  const emptyForm = {
    patient_id: "",
    visit_date: "",
    visit_type: "",
    chief_complaint: "",
    symptoms: "",
    diagnosis: "",
    treatment_plan: "",
    doctor_notes: "",

    temperature: "",
    blood_pressure: "",
    heart_rate: "",
    respiratory_rate: "",
    oxygen_saturation: "",

    prescription: "",
    follow_up_date: "",
  };

  // --------------------------------
  // State
  // --------------------------------

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // --------------------------------
  // Load Patients
  // --------------------------------

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to load patients:", error);
      toast.error("Failed to load patients.");
    }
  };

  // --------------------------------
  // Load Medical Records
  // --------------------------------

  const loadRecords = async () => {
    try {
      const data = await getMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error("Failed to load medical records:", error);
      toast.error("Failed to load medical records.");
    }
  };

  // --------------------------------
  // Initial Load
  // --------------------------------

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await Promise.all([
        loadRecords(),
        loadPatients(),
      ]);

      setLoading(false);
    };

    init();
  }, []);

  // --------------------------------
  // Search
  // --------------------------------

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return records;
    }

    return records.filter((record) => {
      return (
        (record.chief_complaint || "")
          .toLowerCase()
          .includes(query) ||

        (record.diagnosis || "")
          .toLowerCase()
          .includes(query) ||

        (record.symptoms || "")
          .toLowerCase()
          .includes(query) ||

        (record.visit_type || "")
          .toLowerCase()
          .includes(query) ||

        (record.patient_id || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [records, search]);

  // --------------------------------
  // Statistics
  // --------------------------------

  const stats = useMemo(() => {
    const total = records.length;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const todayVisits = records.filter(
      (record) => record.visit_date === today
    ).length;

    const highRisk = records.filter(
      (record) =>
        typeof record.ai_risk_score === "number" &&
        record.ai_risk_score >= 70
    ).length;

    const followUps = records.filter(
      (record) => record.follow_up_date
    ).length;

    return {
      total,
      todayVisits,
      highRisk,
      followUps,
    };
  }, [records]);

  // --------------------------------
  // Prepare Form Data
  // --------------------------------
  // Convert empty strings to null for
  // optional numeric/date fields.
  // This prevents FastAPI 422 errors.

  const preparePayload = (data) => {
    return {
      patient_id: data.patient_id || null,

      visit_date: data.visit_date || null,

      visit_type: data.visit_type || null,

      chief_complaint: data.chief_complaint || "",

      symptoms: data.symptoms || null,

      diagnosis: data.diagnosis || null,

      treatment_plan: data.treatment_plan || null,

      doctor_notes: data.doctor_notes || null,

      temperature:
        data.temperature === "" ||
        data.temperature === null ||
        data.temperature === undefined
          ? null
          : Number(data.temperature),

      blood_pressure:
        data.blood_pressure || null,

      heart_rate:
        data.heart_rate === "" ||
        data.heart_rate === null ||
        data.heart_rate === undefined
          ? null
          : Number(data.heart_rate),

      respiratory_rate:
        data.respiratory_rate === "" ||
        data.respiratory_rate === null ||
        data.respiratory_rate === undefined
          ? null
          : Number(data.respiratory_rate),

      oxygen_saturation:
        data.oxygen_saturation === "" ||
        data.oxygen_saturation === null ||
        data.oxygen_saturation === undefined
          ? null
          : Number(data.oxygen_saturation),

      prescription:
        data.prescription || null,

      follow_up_date:
        data.follow_up_date || null,
    };
  };

  // --------------------------------
  // Add Medical Record
  // --------------------------------

  const addRecord = async () => {
    try {
      setSaving(true);

      const payload = preparePayload(formData);

      console.log("Medical Record Payload:", payload);

      await createMedicalRecord(payload);

      toast.success(
        "Medical record added successfully."
      );

      setFormData(emptyForm);

      await loadRecords();

      return true;
    } catch (error) {
      console.error(
        "Failed to add medical record:",
        error
      );

      // Show backend validation message if available
      if (error.response?.data?.detail) {
        console.error(
          "Backend validation:",
          error.response.data.detail
        );
      }

      toast.error(
        "Failed to add medical record."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Edit Medical Record
  // --------------------------------

  const editRecord = async (id) => {
    try {
      setSaving(true);

      const payload = preparePayload(formData);

      console.log(
        "Medical Record Update Payload:",
        payload
      );

      await updateMedicalRecord(id, payload);

      toast.success(
        "Medical record updated successfully."
      );

      await loadRecords();

      return true;
    } catch (error) {
      console.error(
        "Failed to update medical record:",
        error
      );

      if (error.response?.data?.detail) {
        console.error(
          "Backend validation:",
          error.response.data.detail
        );
      }

      toast.error(
        "Failed to update medical record."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Delete Medical Record
  // --------------------------------

  const removeRecord = async (id) => {
    try {
      setSaving(true);

      await deleteMedicalRecord(id);

      toast.success(
        "Medical record deleted successfully."
      );

      await loadRecords();

      return true;
    } catch (error) {
      console.error(
        "Failed to delete medical record:",
        error
      );

      toast.error(
        "Failed to delete medical record."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Return
  // --------------------------------

  return {
    records,
    filteredRecords,

    loading,
    saving,

    stats,

    search,
    setSearch,

    formData,
    setFormData,

    emptyForm,

    patients,

    loadRecords,
    loadPatients,

    addRecord,
    editRecord,
    removeRecord,
  };
}