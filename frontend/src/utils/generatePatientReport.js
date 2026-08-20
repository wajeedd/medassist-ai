import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// ============================================================
// MEDASSIST AI — PROFESSIONAL PATIENT REPORT GENERATOR
// ============================================================

export const generatePatientReport = ({
  patient,
  medicalRecords = [],
  longitudinalAnalysis = null,
  reportStats = {},
}) => {

  if (!patient) {
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 15;

  // ----------------------------------------------------------
  // COLORS
  // ----------------------------------------------------------

  const primary = [37, 99, 235];
  const dark = [30, 41, 59];
  const gray = [100, 116, 139];
  const lightGray = [226, 232, 240];
  const purple = [124, 58, 237];
  const green = [22, 163, 74];
  const red = [220, 38, 38];
  const orange = [234, 88, 12];

  // ----------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const safeText = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return String(value);
  };


  const riskLevel = (score) => {

    if (
      score === null ||
      score === undefined ||
      Number.isNaN(Number(score))
    ) {
      return "N/A";
    }

    const value = Number(score);

    if (value >= 70) {
      return "High";
    }

    if (value >= 40) {
      return "Moderate";
    }

    return "Low";
  };


  const addPageTitle = (title, subtitle = "") => {

    doc.setTextColor(...dark);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(title, margin, 20);

    if (subtitle) {

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);

      doc.text(
        subtitle,
        margin,
        27
      );
    }
  };


  const drawFooter = () => {

    const totalPages =
      doc.internal.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      doc.setPage(page);

      doc.setDrawColor(...lightGray);

      doc.line(
        margin,
        pageHeight - 16,
        pageWidth - margin,
        pageHeight - 16
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);

      doc.text(
        "MedAssist AI — Clinical Decision Support System",
        margin,
        pageHeight - 9
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 9,
        {
          align: "right",
        }
      );
    }
  };


  // ==========================================================
  // SIMPLE LINE CHART
  // ==========================================================

  const drawLineChart = ({
    title,
    data,
    valueKey,
    x,
    y,
    width,
    height,
    color,
    minValue = null,
    maxValue = null,
  }) => {

    if (!data || data.length === 0) {

      doc.setFontSize(10);
      doc.setTextColor(...gray);

      doc.text(
        `${title}: No data available`,
        x,
        y + 10
      );

      return;
    }

    const validData = data
      .map((item) => ({
        label: item.label,
        value: Number(item[valueKey]),
      }))
      .filter(
        (item) =>
          Number.isFinite(item.value)
      );

    if (validData.length === 0) {

      doc.setFontSize(10);
      doc.setTextColor(...gray);

      doc.text(
        `${title}: No data available`,
        x,
        y + 10
      );

      return;
    }

    // --------------------------------------------------------
    // Chart container
    // --------------------------------------------------------

    doc.setDrawColor(...lightGray);
    doc.setFillColor(248, 250, 252);

    doc.roundedRect(
      x,
      y,
      width,
      height,
      3,
      3,
      "FD"
    );

    // --------------------------------------------------------
    // Title
    // --------------------------------------------------------

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);

    doc.text(
      title,
      x + 6,
      y + 9
    );

    // --------------------------------------------------------
    // Calculate scale
    // --------------------------------------------------------

    let minimum =
      minValue !== null
        ? minValue
        : Math.min(
            ...validData.map(
              (item) => item.value
            )
          );

    let maximum =
      maxValue !== null
        ? maxValue
        : Math.max(
            ...validData.map(
              (item) => item.value
            )
          );

    if (minimum === maximum) {

      minimum -= 1;
      maximum += 1;
    }

    const padding =
      (maximum - minimum) * 0.1;

    if (minValue === null) {
      minimum -= padding;
    }

    if (maxValue === null) {
      maximum += padding;
    }

    const chartLeft = x + 12;
    const chartRight =
      x + width - 8;

    const chartTop = y + 17;
    const chartBottom =
      y + height - 15;

    const chartWidth =
      chartRight - chartLeft;

    const chartHeight =
      chartBottom - chartTop;

    // --------------------------------------------------------
    // Grid
    // --------------------------------------------------------

    doc.setDrawColor(220, 226, 232);
    doc.setLineWidth(0.2);

    for (let i = 0; i <= 4; i++) {

      const gridY =
        chartTop +
        (chartHeight / 4) * i;

      doc.line(
        chartLeft,
        gridY,
        chartRight,
        gridY
      );
    }

    // --------------------------------------------------------
    // Axis
    // --------------------------------------------------------

    doc.setDrawColor(...gray);
    doc.setLineWidth(0.4);

    doc.line(
      chartLeft,
      chartTop,
      chartLeft,
      chartBottom
    );

    doc.line(
      chartLeft,
      chartBottom,
      chartRight,
      chartBottom
    );

    // --------------------------------------------------------
    // Y labels
    // --------------------------------------------------------

    doc.setFontSize(6);
    doc.setTextColor(...gray);

    for (let i = 0; i <= 4; i++) {

      const value =
        maximum -
        ((maximum - minimum) / 4) * i;

      const labelY =
        chartTop +
        (chartHeight / 4) * i +
        2;

      doc.text(
        value.toFixed(0),
        chartLeft - 3,
        labelY,
        {
          align: "right",
        }
      );
    }

    // --------------------------------------------------------
    // Points
    // --------------------------------------------------------

    const points =
      validData.map(
        (item, index) => {

          const pointX =
            validData.length === 1
              ? chartLeft +
                chartWidth / 2
              : chartLeft +
                (chartWidth /
                  (validData.length - 1)) *
                  index;

          const normalized =
            (item.value - minimum) /
            (maximum - minimum);

          const pointY =
            chartBottom -
            normalized *
              chartHeight;

          return {
            x: pointX,
            y: pointY,
            label: item.label,
            value: item.value,
          };
        }
      );

    // --------------------------------------------------------
    // Line
    // --------------------------------------------------------

    doc.setDrawColor(...color);
    doc.setLineWidth(1.2);

    for (
      let i = 1;
      i < points.length;
      i++
    ) {

      doc.line(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y
      );
    }

    // --------------------------------------------------------
    // Dots
    // --------------------------------------------------------

    points.forEach((point) => {

      doc.setFillColor(...color);

      doc.circle(
        point.x,
        point.y,
        1.5,
        "F"
      );

      doc.setFontSize(6);
      doc.setTextColor(...dark);

      doc.text(
        point.value.toFixed(1),
        point.x,
        point.y - 3,
        {
          align: "center",
        }
      );
    });

    // --------------------------------------------------------
    // X labels
    // --------------------------------------------------------

    points.forEach((point) => {

      doc.setFontSize(5.5);
      doc.setTextColor(...gray);

      doc.text(
        point.label,
        point.x,
        chartBottom + 7,
        {
          align: "center",
        }
      );
    });
  };


  // ==========================================================
  // PAGE 1 — HEADER + PATIENT INFORMATION
  // ==========================================================

  doc.setFillColor(...primary);

  doc.rect(
    0,
    0,
    pageWidth,
    36,
    "F"
  );

  doc.setTextColor(255, 255, 255);

  doc.setFontSize(23);
  doc.setFont("helvetica", "bold");

  doc.text(
    "MedAssist AI",
    margin,
    15
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Clinical Patient Report",
    margin,
    24
  );

  doc.setFontSize(8);

  doc.text(
    `Generated: ${new Date().toLocaleDateString(
      "en-IN"
    )}`,
    pageWidth - margin,
    18,
    {
      align: "right",
    }
  );


  // Patient section

  let y = 48;

  doc.setTextColor(...dark);

  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Patient Information",
    margin,
    y
  );

  y += 7;

  autoTable(doc, {

    startY: y,

    theme: "grid",

    head: [
      [
        "Field",
        "Information",
      ],
    ],

    body: [

      [
        "Name",
        `${safeText(
          patient.first_name
        )} ${safeText(
          patient.last_name
        )}`,
      ],

      [
        "Gender",
        safeText(patient.gender),
      ],

      [
        "Date of Birth",
        safeText(
          formatDate(
            patient.date_of_birth
          )
        ),
      ],

      [
        "Phone",
        safeText(patient.phone),
      ],

      [
        "Email",
        safeText(patient.email),
      ],

      [
        "Blood Group",
        safeText(
          patient.blood_group
        ),
      ],

      [
        "Address",
        [
          patient.address,
          patient.city,
          patient.state,
          patient.country,
          patient.postal_code,
        ]
          .filter(Boolean)
          .join(", ") || "-",
      ],
    ],

    headStyles: {
      fillColor: primary,
      textColor: 255,
    },

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });


  // ==========================================================
  // CLINICAL SUMMARY
  // ==========================================================

  y =
    doc.lastAutoTable.finalY + 13;

  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);

  doc.text(
    "Clinical Summary",
    margin,
    y
  );

  y += 7;

  autoTable(doc, {

    startY: y,

    theme: "grid",

    head: [
      [
        "Metric",
        "Value",
      ],
    ],

    body: [

      [
        "Total Visits",
        safeText(
          reportStats.totalVisits
        ),
      ],

      [
        "Average AI Risk",
        reportStats.averageRisk !== null &&
        reportStats.averageRisk !== undefined
          ? `${Number(
              reportStats.averageRisk
            ).toFixed(1)}%`
          : "N/A",
      ],

      [
        "High Risk Visits",
        safeText(
          reportStats.highRiskCount
        ),
      ],

      [
        "Latest AI Risk",
        reportStats.latestRecord?.ai_risk_score !==
          null &&
        reportStats.latestRecord?.ai_risk_score !==
          undefined
          ? `${reportStats.latestRecord.ai_risk_score}%`
          : "N/A",
      ],

      [
        "Latest Risk Level",
        riskLevel(
          reportStats.latestRecord?.ai_risk_score
        ),
      ],
    ],

    headStyles: {
      fillColor: primary,
      textColor: 255,
    },

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });


  // ==========================================================
  // PAGE 2 — AI + VITAL CHARTS
  // ==========================================================

  doc.addPage();

  addPageTitle(
    "Clinical Analytics",
    "Visual representation of risk and vital-sign trends"
  );


  // Prepare chart data

  const riskData =
    medicalRecords
      .filter(
        (record) =>
          typeof record.ai_risk_score ===
          "number"
      )
      .map((record) => ({
        label: formatDate(
          record.visit_date
        ),
        value: record.ai_risk_score,
      }));


  const temperatureData =
    medicalRecords
      .filter(
        (record) =>
          typeof record.temperature ===
          "number"
      )
      .map((record) => ({
        label: formatDate(
          record.visit_date
        ),
        value: record.temperature,
      }));


  const heartRateData =
    medicalRecords
      .filter(
        (record) =>
          typeof record.heart_rate ===
          "number"
      )
      .map((record) => ({
        label: formatDate(
          record.visit_date
        ),
        value: record.heart_rate,
      }));


  const oxygenData =
    medicalRecords
      .filter(
        (record) =>
          typeof record.oxygen_saturation ===
          "number"
      )
      .map((record) => ({
        label: formatDate(
          record.visit_date
        ),
        value: record.oxygen_saturation,
      }));


  const respiratoryData =
    medicalRecords
      .filter(
        (record) =>
          typeof record.respiratory_rate ===
          "number"
      )
      .map((record) => ({
        label: formatDate(
          record.visit_date
        ),
        value: record.respiratory_rate,
      }));


  // AI Risk chart

  drawLineChart({
    title: "AI Risk Score Trend",
    data: riskData,
    valueKey: "value",
    x: margin,
    y: 38,
    width: pageWidth - 30,
    height: 65,
    color: purple,
    minValue: 0,
    maxValue: 100,
  });


  // Vital charts

  drawLineChart({
    title: "Temperature (°F)",
    data: temperatureData,
    valueKey: "value",
    x: margin,
    y: 110,
    width: 87,
    height: 60,
    color: orange,
  });


  drawLineChart({
    title: "Heart Rate (bpm)",
    data: heartRateData,
    valueKey: "value",
    x: 108,
    y: 110,
    width: 87,
    height: 60,
    color: red,
  });


  drawLineChart({
    title: "Oxygen Saturation (%)",
    data: oxygenData,
    valueKey: "value",
    x: margin,
    y: 177,
    width: 87,
    height: 60,
    color: [8, 145, 178],
  });


  drawLineChart({
    title: "Respiratory Rate",
    data: respiratoryData,
    valueKey: "value",
    x: 108,
    y: 177,
    width: 87,
    height: 60,
    color: green,
  });


  // ==========================================================
  // PAGE 3 — LONGITUDINAL AI INSIGHTS
  // ==========================================================

  doc.addPage();

  addPageTitle(
    "Longitudinal AI Insights",
    "AI-powered analysis of the patient's complete clinical history"
  );


  if (longitudinalAnalysis) {

    let aiY = 38;


    // --------------------------------------------------------
    // AI Summary Cards
    // --------------------------------------------------------

    autoTable(doc, {

      startY: aiY,

      theme: "grid",

      head: [
        [
          "AI Assessment",
          "Result",
        ],
      ],

      body: [

        [
          "Overall Health Trend",
          safeText(
            longitudinalAnalysis
              .overall_health_trend
          ),
        ],

        [
          "Overall Risk Level",
          safeText(
            longitudinalAnalysis
              .overall_risk_level
          ),
        ],

        [
          "Average Risk Score",
          typeof longitudinalAnalysis
            .average_risk_score ===
          "number"
            ? `${longitudinalAnalysis.average_risk_score.toFixed(
                1
              )}%`
            : "N/A",
        ],
      ],

      headStyles: {
        fillColor: purple,
        textColor: 255,
      },

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });


    aiY =
      doc.lastAutoTable.finalY + 10;


    // --------------------------------------------------------
    // Risk Evolution
    // --------------------------------------------------------

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...purple);

    doc.text(
      "Risk Evolution",
      margin,
      aiY
    );

    aiY += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...dark);

    const riskEvolution =
      safeText(
        longitudinalAnalysis.risk_evolution
      );

    const riskEvolutionLines =
      doc.splitTextToSize(
        riskEvolution,
        pageWidth - 30
      );

    doc.text(
      riskEvolutionLines,
      margin,
      aiY
    );

    aiY +=
      riskEvolutionLines.length * 4.5 +
      9;


    // --------------------------------------------------------
    // Generic AI Section
    // --------------------------------------------------------

    const addAISection = (
      title,
      items
    ) => {

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return;
      }

      // New page if required

      if (aiY > pageHeight - 55) {

        doc.addPage();

        aiY = 20;
      }


      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);

      doc.text(
        title,
        margin,
        aiY
      );

      aiY += 6;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...dark);


      items.forEach(
        (item) => {

          const lines =
            doc.splitTextToSize(
              `• ${safeText(item)}`,
              pageWidth - 32
            );

          if (
            aiY +
              lines.length * 4.5 >
            pageHeight - 25
          ) {

            doc.addPage();

            aiY = 20;
          }

          doc.text(
            lines,
            margin,
            aiY
          );

          aiY +=
            lines.length * 4.5 + 2;
        }
      );

      aiY += 5;
    };


    addAISection(
      "Key Observations",
      longitudinalAnalysis.key_observations
    );


    addAISection(
      "Recurring Conditions",
      longitudinalAnalysis.recurring_conditions
    );


    addAISection(
      "Recurring Complaints",
      longitudinalAnalysis.recurring_complaints
    );


    addAISection(
      "Important Changes",
      longitudinalAnalysis.important_changes
    );


    addAISection(
      "Follow-up Recommendations",
      longitudinalAnalysis.follow_up_recommendations
    );

  } else {

    doc.setFontSize(10);
    doc.setTextColor(...gray);

    doc.text(
      "Longitudinal AI analysis is not available.",
      margin,
      45
    );
  }


  // ==========================================================
  // CLINICAL HISTORY
  // ==========================================================

  doc.addPage();

  addPageTitle(
    "Clinical History",
    "Complete recorded medical visits"
  );


  if (medicalRecords.length > 0) {

    const historyRows =
      medicalRecords.map(
        (record) => [

          formatDate(
            record.visit_date
          ),

          safeText(
            record.visit_type
          ).replaceAll(
            "_",
            " "
          ),

          safeText(
            record.chief_complaint
          ),

          safeText(
            record.diagnosis
          ),

          record.ai_risk_score !==
            null &&
          record.ai_risk_score !==
            undefined
            ? `${record.ai_risk_score}%`
            : "N/A",
        ]
      );


    autoTable(doc, {

      startY: 38,

      theme: "grid",

      head: [
        [
          "Date",
          "Visit Type",
          "Chief Complaint",
          "Diagnosis",
          "AI Risk",
        ],
      ],

      body: historyRows,

      headStyles: {
        fillColor: primary,
        textColor: 255,
      },

      styles: {
        fontSize: 7.5,
        cellPadding: 2.5,
      },

      columnStyles: {

        0: {
          cellWidth: 25,
        },

        1: {
          cellWidth: 30,
        },

        2: {
          cellWidth: 50,
        },

        3: {
          cellWidth: 55,
        },

        4: {
          cellWidth: 20,
        },
      },
    });

  } else {

    doc.setFontSize(10);
    doc.setTextColor(...gray);

    doc.text(
      "No clinical history available.",
      margin,
      45
    );
  }


  // ==========================================================
  // DETAILED VISIT INFORMATION
  // ==========================================================

  doc.addPage();

  addPageTitle(
    "Detailed Clinical Visits",
    "Symptoms, diagnosis, treatment and recorded vital signs"
  );


  let detailY = 38;


  medicalRecords.forEach(
    (record, index) => {

      if (
        detailY >
        pageHeight - 75
      ) {

        doc.addPage();

        detailY = 20;
      }


      // Visit heading

      doc.setFillColor(
        241,
        245,
        249
      );

      doc.roundedRect(
        margin,
        detailY - 5,
        pageWidth - 30,
        9,
        2,
        2,
        "F"
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);

      doc.text(
        `Visit ${index + 1} — ${formatDate(
          record.visit_date
        )}`,
        margin + 4,
        detailY + 1
      );

      detailY += 10;


      const visitRows = [

        [
          "Visit Type",
          safeText(
            record.visit_type
          ),
        ],

        [
          "Chief Complaint",
          safeText(
            record.chief_complaint
          ),
        ],

        [
          "Symptoms",
          safeText(
            record.symptoms
          ),
        ],

        [
          "Diagnosis",
          safeText(
            record.diagnosis
          ),
        ],

        [
          "Treatment Plan",
          safeText(
            record.treatment_plan
          ),
        ],

        [
          "Doctor Notes",
          safeText(
            record.doctor_notes
          ),
        ],

        [
          "Temperature",
          record.temperature !==
            null &&
          record.temperature !==
            undefined
            ? `${record.temperature} °F`
            : "Not recorded",
        ],

        [
          "Blood Pressure",
          safeText(
            record.blood_pressure
          ),
        ],

        [
          "Heart Rate",
          record.heart_rate !==
            null &&
          record.heart_rate !==
            undefined
            ? `${record.heart_rate} bpm`
            : "Not recorded",
        ],

        [
          "Respiratory Rate",
          record.respiratory_rate !==
            null &&
          record.respiratory_rate !==
            undefined
            ? `${record.respiratory_rate} /min`
            : "Not recorded",
        ],

        [
          "Oxygen Saturation",
          record.oxygen_saturation !==
            null &&
          record.oxygen_saturation !==
            undefined
            ? `${record.oxygen_saturation}%`
            : "Not recorded",
        ],

        [
          "AI Risk Score",
          record.ai_risk_score !==
            null &&
          record.ai_risk_score !==
            undefined
            ? `${record.ai_risk_score}% (${riskLevel(
                record.ai_risk_score
              )})`
            : "Not available",
        ],

        [
          "AI Summary",
          safeText(
            record.ai_summary
          ),
        ],

        [
          "AI Recommendation",
          safeText(
            record.ai_recommendation
          ),
        ],
      ];


      autoTable(doc, {

        startY: detailY,

        theme: "grid",

        body: visitRows,

        styles: {
          fontSize: 7.5,
          cellPadding: 2.5,
          overflow: "linebreak",
        },

        columnStyles: {

          0: {
            cellWidth: 38,
            fontStyle: "bold",
          },

          1: {
            cellWidth: 142,
          },
        },

        didDrawPage: () => {
          // Footer handled later.
        },
      });


      detailY =
        doc.lastAutoTable.finalY + 10;
    }
  );


  // ==========================================================
  // FINAL AI DISCLAIMER
  // ==========================================================

  doc.addPage();

  addPageTitle(
    "AI Clinical Decision Support Notice"
  );


  doc.setFillColor(
    255,
    248,
    230
  );

  doc.setDrawColor(
    253,
    186,
    116
  );

  doc.roundedRect(
    margin,
    40,
    pageWidth - 30,
    55,
    4,
    4,
    "FD"
  );


  doc.setTextColor(
    146,
    64,
    14
  );

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");

  doc.text(
    "AI Insight Notice",
    margin + 8,
    52
  );


  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");


  const disclaimer =
    "These longitudinal insights and risk assessments are generated by AI from the patient's available clinical records. They are intended to assist qualified healthcare professionals in reviewing patient information and should not replace professional medical judgment, clinical examination, diagnosis, or treatment decisions.";


  const disclaimerLines =
    doc.splitTextToSize(
      disclaimer,
      pageWidth - 46
    );


  doc.text(
    disclaimerLines,
    margin + 8,
    62
  );


  // ==========================================================
  // FOOTERS
  // ==========================================================

  drawFooter();


  // ==========================================================
  // SAVE FILE
  // ==========================================================

  const firstName =
    patient.first_name ||
    "Patient";

  const lastName =
    patient.last_name ||
    "";

  const patientName =
    `${firstName}_${lastName}`
      .trim()
      .replace(/\s+/g, "_");


  doc.save(
    `MedAssist_AI_${patientName}_Clinical_Report.pdf`
  );
};