from pathlib import Path
import re

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "diabetes_random_forest.joblib"


FEATURE_COLUMNS = [
    "Age",
    "Gender",
    "Polyuria",
    "Polydipsia",
    "sudden weight loss",
    "weakness",
    "Polyphagia",
    "Genital thrush",
    "visual blurring",
    "Itching",
    "Irritability",
    "delayed healing",
    "partial paresis",
    "muscle stiffness",
    "Alopecia",
    "Obesity",
]


SYMPTOM_PATTERNS = {
   "Polyuria": [
    r"\bfrequent urination\b",
    r"\bincreased urination\b",
    r"\burinating frequently\b",
    r"\bexcessive urination\b",
    r"\bimproved urination\b",
    r"\bimproved .*?\burination\b",
    r"\breduced .*?\burination\b",
    r"\bpolyuria\b",
],
    "Polydipsia": [
    r"\bincreased thirst\b",
    r"\bexcessive thirst\b",
    r"\bvery thirsty\b",
    r"\bimproved thirst\b",
    r"\bimproved .*?\bthirst\b",
    r"\breduced .*?\bthirst\b",
    r"\bpolydipsia\b",
],
    "sudden weight loss": [
        r"\bsudden weight loss\b",
        r"\bunexplained weight loss\b",
        r"\brapid weight loss\b",
    ],
    "weakness": [
        r"\bweakness\b",
        r"\bweak\b",
        r"\bfatigue\b",
        r"\btiredness\b",
        r"\btired\b",
        r"\blow energy\b",
    ],
    "Polyphagia": [
        r"\bexcessive hunger\b",
        r"\bincreased appetite\b",
        r"\bpolyphagia\b",
    ],
    "Genital thrush": [
        r"\bgenital thrush\b",
        r"\bgenital yeast\b",
        r"\byeast infection\b",
    ],
    "visual blurring": [
        r"\bblurred vision\b",
        r"\bblurry vision\b",
        r"\bvisual blurring\b",
        r"\bblurred eyesight\b",
    ],
    "Itching": [
        r"\bitching\b",
        r"\bitchy\b",
        r"\bpruritus\b",
    ],
    "Irritability": [
        r"\birritability\b",
        r"\birritable\b",
    ],
    "delayed healing": [
        r"\bdelayed healing\b",
        r"\bwound.*not healing\b",
        r"\bslow healing\b",
    ],
    "partial paresis": [
        r"\bpartial paresis\b",
        r"\bpartial weakness\b",
        r"\bmuscle weakness\b",
    ],
    "muscle stiffness": [
        r"\bmuscle stiffness\b",
        r"\bstiff muscles\b",
        r"\bmuscle stiff\b",
    ],
    "Alopecia": [
        r"\balopecia\b",
        r"\bhair loss\b",
        r"\blosing hair\b",
    ],
    "Obesity": [
        r"\bobesity\b",
        r"\bobese\b",
    ],
}


NEGATION_PATTERNS = [
    r"\bno\b",
    r"\bnot\b",
    r"\bwithout\b",
    r"\bdenies\b",
    r"\bdenied\b",
    r"\bnegative for\b",
    r"\babsence of\b",
]


def _is_negated(text: str, start_index: int) -> bool:
    """
    Look at a small text window immediately before a detected symptom
    and determine whether the symptom is explicitly negated.
    """

    window_start = max(0, start_index - 60)
    preceding_text = text[window_start:start_index].lower()

    for pattern in NEGATION_PATTERNS:
        if re.search(pattern, preceding_text):
            return True

    return False


def _detect_feature(text: str, patterns: list[str]) -> bool | None:
    """
    Returns:
        True  -> symptom explicitly detected
        False -> symptom explicitly negated
        None  -> insufficient information
    """

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if not match:
            continue

        if _is_negated(text, match.start()):
            return False

        return True

    return None


def _extract_age(patient) -> int | None:
    if not patient or not getattr(patient, "date_of_birth", None):
        return None

    from datetime import date

    dob = patient.date_of_birth
    today = date.today()

    age = today.year - dob.year

    if (today.month, today.day) < (dob.month, dob.day):
        age -= 1

    return age


def _extract_gender(patient) -> str | None:
    if not patient:
        return None

    gender = getattr(patient, "gender", None)

    if not gender:
        return None

    gender = str(gender).strip().lower()

    if gender == "male":
        return "Male"

    if gender == "female":
        return "Female"

    return None


def _build_clinical_text(record) -> str:
    parts = [
        getattr(record, "chief_complaint", None),
        getattr(record, "symptoms", None),
        getattr(record, "doctor_notes", None),
    ]

    return " ".join(
        str(part)
        for part in parts
        if part
    )


class DiabetesPredictor:
    def __init__(self, model_path: Path = MODEL_PATH):
        self.model_path = Path(model_path)
        self.model = None

        self._load_model()

    def _load_model(self):
        if not self.model_path.exists():
            self.model = None
            return

        try:
            self.model = joblib.load(self.model_path)
        except Exception:
            self.model = None

    def available(self) -> bool:
        return self.model is not None

    def predict(self, medical_record):
        """
        Generate a dataset-based diabetes risk prediction from
        clinical information contained in a MedicalRecord.

        Diagnosis and treatment fields are intentionally excluded
        to avoid target leakage.
        """

        if not self.available():
            return {
                "risk_score": None,
                "prediction": "Model Unavailable",
                "model": "Random Forest Classifier",
                "dataset": "UCI Early Stage Diabetes Risk Prediction Dataset",
                "feature_coverage": 0.0,
                "detected_features": {},
            }

        patient = getattr(medical_record, "patient", None)

        age = _extract_age(patient)
        gender = _extract_gender(patient)

        clinical_text = _build_clinical_text(
            medical_record
        ).lower()

        detected_features = {}

        for feature, patterns in SYMPTOM_PATTERNS.items():
            detected_features[feature] = _detect_feature(
                clinical_text,
                patterns,
            )

        known_symptoms = [
            value
            for value in detected_features.values()
            if value is not None
        ]

        feature_coverage = (
            len(known_symptoms) / len(SYMPTOM_PATTERNS)
        )

        # Require at least two known symptom features.
        # This prevents the model from producing a misleading
        # probability when the clinical documentation is too sparse.
        if len(known_symptoms) < 2:
            return {
                "risk_score": None,
                "prediction": "Insufficient Data",
                "model": "Random Forest Classifier",
                "dataset": "UCI Early Stage Diabetes Risk Prediction Dataset",
                "feature_coverage": round(
                    feature_coverage * 100,
                    2,
                ),
                "detected_features": detected_features,
            }

        # The trained dataset contains 16 features.
        # Unknown age/gender are represented as missing values
        # and handled by the training pipeline.
        row = {
            "Age": age,
            "Gender": gender,
        }

        for feature in SYMPTOM_PATTERNS:
            value = detected_features[feature]

            if value is True:
                row[feature] = "Yes"
            elif value is False:
                row[feature] = "No"
            else:
                row[feature] = None

        input_df = pd.DataFrame(
            [row],
            columns=FEATURE_COLUMNS,
        )

        try:
            probability = float(
                self.model.predict_proba(input_df)[0][1]
            )

            prediction = (
                "Positive"
                if probability >= 0.50
                else "Negative"
            )

            return {
                "risk_score": round(
                    probability * 100,
                    2,
                ),
                "prediction": prediction,
                "model": "Random Forest Classifier",
                "dataset": "UCI Early Stage Diabetes Risk Prediction Dataset",
                "feature_coverage": round(
                    feature_coverage * 100,
                    2,
                ),
                "detected_features": detected_features,
            }

        except Exception:
            return {
                "risk_score": None,
                "prediction": "Prediction Error",
                "model": "Random Forest Classifier",
                "dataset": "UCI Early Stage Diabetes Risk Prediction Dataset",
                "feature_coverage": round(
                    feature_coverage * 100,
                    2,
                ),
                "detected_features": detected_features,
            }


diabetes_predictor = DiabetesPredictor()