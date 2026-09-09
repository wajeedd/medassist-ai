from pathlib import Path
import json

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "diabetes_data_upload.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "diabetes_random_forest.joblib"
METRICS_PATH = MODEL_DIR / "diabetes_model_metrics.json"


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

TARGET_COLUMN = "class"


def normalize_value(value):
    if pd.isna(value):
        return value

    value = str(value).strip()

    replacements = {
        "Yes": "Yes",
        "No": "No",
        "Male": "Male",
        "Female": "Female",
        "Positive": "Positive",
        "Negative": "Negative",
    }

    return replacements.get(value, value)


def main():
    print("=" * 70)
    print("MedAssist AI - Diabetes Random Forest Training")
    print("=" * 70)

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_PATH}"
        )

    print(f"\nLoading dataset:")
    print(DATA_PATH)

    df = pd.read_csv(DATA_PATH)

    print(f"\nDataset shape: {df.shape}")

    missing_columns = [
        column
        for column in FEATURE_COLUMNS + [TARGET_COLUMN]
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    # Normalize categorical values
    categorical_columns = [
        column for column in FEATURE_COLUMNS
        if column != "Age"
    ]

    for column in categorical_columns:
        df[column] = df[column].map(normalize_value)

    # Convert target
    target_mapping = {
        "Positive": 1,
        "Negative": 0,
    }

    df[TARGET_COLUMN] = (
        df[TARGET_COLUMN]
        .astype(str)
        .str.strip()
        .map(target_mapping)
    )

    if df[TARGET_COLUMN].isna().any():
        raise ValueError("Unexpected target values found in dataset.")

    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].astype(int)

    numeric_features = ["Age"]
    categorical_features = [
        column for column in FEATURE_COLUMNS
        if column != "Age"
    ]

    # Numeric preprocessing
    numeric_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            )
        ]
    )

    # Categorical preprocessing
    categorical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="most_frequent"),
            ),
            (
                "encoder",
                OrdinalEncoder(
                    handle_unknown="use_encoded_value",
                    unknown_value=-1,
                ),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numeric",
                numeric_pipeline,
                numeric_features,
            ),
            (
                "categorical",
                categorical_pipeline,
                categorical_features,
            ),
        ]
    )

    classifier = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        min_samples_leaf=2,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", classifier),
        ]
    )

    print("\nTarget distribution:")
    print(df[TARGET_COLUMN].map({1: "Positive", 0: "Negative"}).value_counts())

    # 80/20 stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print("\nTraining samples:", len(X_train))
    print("Testing samples:", len(X_test))

    print("\nTraining Random Forest...")
    pipeline.fit(X_train, y_train)

    # Predictions
    y_pred = pipeline.predict(X_test)
    y_probability = pipeline.predict_proba(X_test)[:, 1]

    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(
        y_test,
        y_pred,
        zero_division=0,
    )
    recall = recall_score(
        y_test,
        y_pred,
        zero_division=0,
    )
    f1 = f1_score(
        y_test,
        y_pred,
        zero_division=0,
    )
    roc_auc = roc_auc_score(
        y_test,
        y_probability,
    )

    cm = confusion_matrix(y_test, y_pred)

    # 5-fold stratified cross-validation
    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    )

    print("\nRunning 5-fold cross-validation...")
    cv_f1_scores = cross_val_score(
        pipeline,
        X,
        y,
        cv=cv,
        scoring="f1",
        n_jobs=-1,
    )

    cv_f1_mean = cv_f1_scores.mean()
    cv_f1_std = cv_f1_scores.std()

    print("\n" + "=" * 70)
    print("MODEL EVALUATION")
    print("=" * 70)

    print(f"\nAccuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")

    print("\nConfusion Matrix:")
    print(cm)

    print(
        f"\n5-Fold CV F1: "
        f"{cv_f1_mean:.4f} ± {cv_f1_std:.4f}"
    )

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            y_pred,
            target_names=["Negative", "Positive"],
            zero_division=0,
        )
    )

    # Feature importance
    feature_names = (
        numeric_features + categorical_features
    )

    trained_preprocessor = pipeline.named_steps["preprocessor"]
    trained_classifier = pipeline.named_steps["classifier"]

    importances = trained_classifier.feature_importances_

    feature_importance = sorted(
        zip(feature_names, importances),
        key=lambda item: item[1],
        reverse=True,
    )

    print("Feature Importance:")
    for feature, importance in feature_importance:
        print(f"{feature}: {importance:.4f}")

    # Train final model on complete dataset
    print("\nTraining final model on complete dataset...")
    pipeline.fit(X, y)

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    import joblib

    joblib.dump(
        pipeline,
        MODEL_PATH,
    )

    metrics = {
        "dataset": "UCI Early Stage Diabetes Risk Prediction Dataset",
        "dataset_records": int(len(df)),
        "feature_count": len(FEATURE_COLUMNS),
        "algorithm": "Random Forest Classifier",
        "n_estimators": 300,
        "random_state": 42,
        "class_weight": "balanced",
        "min_samples_leaf": 2,
        "train_test_split": "80/20 stratified",
        "cross_validation": "5-fold stratified",
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "roc_auc": float(roc_auc),
        "cv_f1_mean": float(cv_f1_mean),
        "cv_f1_std": float(cv_f1_std),
        "confusion_matrix": cm.tolist(),
        "feature_importance": {
            feature: float(importance)
            for feature, importance in feature_importance
        },
    }

    with open(
        METRICS_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            metrics,
            file,
            indent=4,
        )

    print("\n" + "=" * 70)
    print("TRAINING COMPLETE")
    print("=" * 70)

    print(f"\nModel saved to:")
    print(MODEL_PATH)

    print(f"\nMetrics saved to:")
    print(METRICS_PATH)


if __name__ == "__main__":
    main()