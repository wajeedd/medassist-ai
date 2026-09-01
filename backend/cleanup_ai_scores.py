from app.database.session import SessionLocal
from app.models.medical_record import MedicalRecord


RECORD_IDS = [
    "a0bff82a-7ba9-4a11-b330-e79732bd2260",  # nooooas
    "e1a77e34-bc65-410e-80de-e9d8380eee5a",  # zxc zx
    "a5d4d348-b106-41c1-a7ac-443dc94e8de7",  # zxc
]


def main():

    db = SessionLocal()

    try:

        records = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.id.in_(RECORD_IDS)
            )
            .all()
        )

        for record in records:

            print(
                f"Cleaning record "
                f"{record.id}"
            )

            print(
                f"Old AI risk score: "
                f"{record.ai_risk_score}"
            )

            record.ai_risk_score = None

        db.commit()

        print()
        print(
            f"Successfully cleaned "
            f"{len(records)} records."
        )

    except Exception as error:

        db.rollback()

        print(
            "Error while cleaning records:",
            error,
        )

    finally:

        db.close()


if __name__ == "__main__":
    main()