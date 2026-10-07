"""add patient role and account link

Revision ID: 60fc15f9f2eb
Revises: 9993a9e09859
Create Date: 2026-10-05
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "60fc15f9f2eb"
down_revision: Union[str, Sequence[str], None] = "9993a9e09859"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add PATIENT to the existing PostgreSQL userrole enum.
    op.execute(
        "ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'PATIENT'"
    )

    # Add a nullable login-account link to patients.
    op.add_column(
        "patients",
        sa.Column(
            "user_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    # Link patients.user_id to users.id.
    op.create_foreign_key(
        "fk_patients_user_id_users",
        "patients",
        "users",
        ["user_id"],
        ["id"],
    )

    # One patient login account can belong to only one patient profile.
    op.create_unique_constraint(
        "uq_patients_user_id",
        "patients",
        ["user_id"],
    )


def downgrade() -> None:
    # Remove the patient account link.
    op.drop_constraint(
        "uq_patients_user_id",
        "patients",
        type_="unique",
    )

    op.drop_constraint(
        "fk_patients_user_id_users",
        "patients",
        type_="foreignkey",
    )

    op.drop_column(
        "patients",
        "user_id",
    )

    # PostgreSQL does not safely support removing an enum value
    # directly. The PATIENT enum value is therefore left in place
    # during downgrade.