const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

/* ===============================
   STUDENT: REQUEST GATE PASS
================================ */
exports.requestGatePass = (req, res) => {
  const { reason, outTime } = req.body;
  const studentId = req.user.id;

  db.query(
    "INSERT INTO gatepass (student_id, reason, out_time) VALUES (?,?,?)",
    [studentId, reason, outTime],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Gate pass requested" });
    }
  );
};

/* ===============================
   STUDENT: GET MY GATE PASSES
================================ */
exports.getMyGatePasses = async (req, res) => {
  const studentId = req.user.id;

  db.query(
    "SELECT * FROM gatepass WHERE student_id=? ORDER BY id DESC",
    [studentId],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      // Generate QR images for approved passes
      const passesWithQR = await Promise.all(
        results.map(async (pass) => {
          if (pass.status === "APPROVED" && pass.qr_token) {
            try {
              const qr_image = await QRCode.toDataURL(pass.qr_token);
              return { ...pass, qr_image };
            } catch (e) {
              return pass;
            }
          }
          return pass;
        })
      );

      res.json(passesWithQR);
    }
  );
};

/* ===============================
   HOD: VIEW PENDING REQUESTS
================================ */
exports.getPendingRequests = (req, res) => {
  db.query(
    "SELECT * FROM gatepass WHERE status='PENDING'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

/* ===============================
   HOD: APPROVE GATE PASS + QR
================================ */
exports.approveGatePass = async (req, res) => {
  const gatePassId = req.params.id;
  const qrToken = uuidv4();

  try {
    const qrImage = await QRCode.toDataURL(qrToken);

    db.query(
      "UPDATE gatepass SET status='APPROVED', qr_token=? WHERE id=?",
      [qrToken, gatePassId],
      (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          message: "Gate pass approved",
          status: "APPROVED",
          qr_token: qrToken,
          qr_image: qrImage
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* ===============================
   WATCHMAN: EXIT USING QR
================================ */
exports.exitGatePass = (req, res) => {
  const { qr_token } = req.body;

  if (!qr_token) {
    return res.status(400).json({ message: "QR token is required" });
  }

  db.query(
    "SELECT * FROM gatepass WHERE qr_token=?",
    [qr_token],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (!result.length) {
        return res.status(404).json({ message: "Invalid QR code - not found" });
      }

      const pass = result[0];

      if (pass.status === "EXITED") {
        return res.status(400).json({ message: "QR already used - student has already exited" });
      }

      if (pass.status !== "APPROVED") {
        return res.status(400).json({ message: "Gate pass not approved yet" });
      }

      db.query(
        "UPDATE gatepass SET status='EXITED', exit_time=NOW() WHERE qr_token=?",
        [qr_token],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.json({
            message: "Student exited successfully",
            student_id: pass.student_id,
            exit_time: new Date().toISOString()
          });
        }
      );
    }
  );
};
