from pathlib import Path
import json

from app.schemas.dashboard import DiabetesModelMetrics


class MLService:

    @staticmethod
    def get_diabetes_model_metrics() -> DiabetesModelMetrics:

        # ==========================================
        # MODEL METRICS FILE
        # ==========================================

        metrics_path = (
            Path(__file__).resolve().parent.parent
            / "ml"
            / "models"
            / "diabetes_model_metrics.json"
        )

        # ==========================================
        # CHECK FILE
        # ==========================================

        if not metrics_path.exists():

            raise FileNotFoundError(
                "Diabetes model metrics file was not found."
            )

        # ==========================================
        # LOAD METRICS
        # ==========================================

        with metrics_path.open(
            "r",
            encoding="utf-8",
        ) as file:

            metrics = json.load(file)

        # ==========================================
        # RETURN VALIDATED RESPONSE
        # ==========================================

        return DiabetesModelMetrics(

    algorithm=metrics["algorithm"],

    dataset=metrics["dataset"],

    accuracy=metrics["accuracy"] * 100,

    precision=metrics["precision"] * 100,

    recall=metrics["recall"] * 100,

    f1_score=metrics["f1_score"] * 100,

    roc_auc=metrics["roc_auc"],

    cv_f1_mean=metrics["cv_f1_mean"] * 100,

    cv_f1_std=metrics["cv_f1_std"] * 100,

    feature_importance=metrics["feature_importance"],

    confusion_matrix=metrics["confusion_matrix"],
)