import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Table,
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  Spinner,
  Alert,
} from "react-bootstrap"; // Added Spinner, Alert
import "./SuccessModal.css"; // Import the success modal styling
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaBed,
  FaIdCard,
  FaUserSlash,
  FaInfoCircle,
  FaEye,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa"; // Added FaEye, FaUpload
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./ManageKos.css";

const ManageKos = () => {
  const navigate = useNavigate();
  const [kosRooms, setKosRooms] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For Add/Edit Room
  const [isEditing, setIsEditing] = useState(false);

  // State untuk notifikasi sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [currentRoom, setCurrentRoom] = useState({
    id: null,
    room_name: "",
    price: "",
    facilities: "",
    availability: true,
    tenant_name: "",
    tenant_phone: "",
    parent_name: "",
    parent_phone: "",
    occupation: "",
    payment_status_current_month: "Belum Bayar",
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [selectedRoomForHistory, setSelectedRoomForHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State untuk Modal Upload Pembayaran Baru
  const [showUploadPaymentModal, setShowUploadPaymentModal] = useState(false);
  const [newPaymentData, setNewPaymentData] = useState({
    bulan_tagihan: "", // YYYY-MM
    jumlah_bayar: "",
    tanggal_pembayaran_lunas: "", // YYYY-MM-DD
    status_pembayaran: "Pending Verifikasi",
    metode_pembayaran: "",
    catatan_pembayaran: "",
    buktiTransferImageFile: null,
  });
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const API_BASE_URL = "http://localhost:3001/api";
  const BACKEND_URL = "http://localhost:3001"; // Untuk URL gambar

  const fetchKosRooms = useCallback(async () => {
    console.log("Fetching all kos rooms..."); // DEBUG
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
      const response = await axios.get(`${API_BASE_URL}/kos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched kos rooms data:", response.data); // DEBUG
      setKosRooms(
        response.data.map((room) => ({
          ...room,
          payment_status_current_month:
            room.payment_status_current_month ||
            (room.tenant_name ? "Belum Bayar" : null),
        }))
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch kos rooms");
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchKosRooms();
  }, [fetchKosRooms]);

  const handleBack = () => navigate("/dashboard");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    const method = isEditing ? "put" : "post";
    const url = isEditing
      ? `${API_BASE_URL}/kos/${currentRoom.id}`
      : `${API_BASE_URL}/kos`;
    const roomDataToSubmit = {
      ...currentRoom,
      tenant_name: currentRoom.tenant_name || null,
      tenant_phone: currentRoom.tenant_phone || null,
      parent_name: currentRoom.parent_name || null,
      parent_phone: currentRoom.parent_phone || null,
      occupation: currentRoom.occupation || null,
      payment_status_current_month:
        currentRoom.payment_status_current_month || "Belum Bayar",
    };
    try {
      await axios[method](url, roomDataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKosRooms();
      setShowModal(false);
      setIsEditing(false);

      // Show success message
      setSuccessMessage(
        isEditing
          ? "Kamar berhasil diperbarui!"
          : "Kamar baru berhasil ditambahkan!"
      );
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

      setCurrentRoom({
        id: null,
        room_name: "",
        price: "",
        facilities: "",
        availability: true,
        tenant_name: "",
        tenant_phone: "",
        parent_name: "",
        parent_phone: "",
        occupation: "",
        payment_status_current_month: "Belum Bayar",
      });
      setError(null);
    } catch (err) {
      // Ditambahkan kurung kurawal pembuka
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} kos room`
      );
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom({
      ...room,
      price: room.price.toString(),
      tenant_name: room.tenant_name || "",
      tenant_phone: room.tenant_phone || "",
      parent_name: room.parent_name || "",
      parent_phone: room.parent_phone || "",
      occupation: room.occupation || "",
      payment_status_current_month:
        room.payment_status_current_month || "Belum Bayar",
    });
    setIsEditing(true);
    setShowModal(true);
  };
  // Handle showing delete confirmation modal
  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirmModal(true);
  };

  // Handle deleting room after confirmation
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token || !roomToDelete) {
      setError("Authentication token or room to delete not found.");
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/kos/${roomToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKosRooms();
      setError(null);
      setShowDeleteConfirmModal(false);
      setRoomToDelete(null);

      // Show success message
      setSuccessMessage(`Kamar "${roomToDelete?.room_name}" berhasil dihapus!`);
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete kos room");
      console.error("Delete error:", err);
      setShowDeleteConfirmModal(false);
      setRoomToDelete(null);
    }
  };

  const openAddModal = () => {
    setCurrentRoom({
      id: null,
      room_name: "",
      price: "",
      facilities: "",
      availability: true,
      tenant_name: "",
      tenant_phone: "",
      parent_name: "",
      parent_phone: "",
      occupation: "",
      payment_status_current_month: "Belum Bayar",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleShowPaymentHistory = async (room) => {
    if (!room || !room.id) {
      setError("Informasi kamar tidak valid.");
      return;
    }
    console.log("Showing payment history for room:", room); // DEBUG
    setSelectedRoomForHistory(room);
    setLoadingHistory(true);
    setShowPaymentHistoryModal(true);
    setPaymentHistoryData([]); // Kosongkan dulu untuk memastikan data baru yang dimuat
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan.");
      const response = await axios.get(
        `${API_BASE_URL}/kos/${room.id}/payment-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched Payment History Data:", response.data); // DEBUG
      setPaymentHistoryData(response.data);
      setError(null); // Bersihkan error utama jika fetch riwayat berhasil
    } catch (err) {
      // Set error spesifik untuk modal riwayat, atau gunakan error global jika perlu
      const historyError =
        err.response?.data?.message || "Gagal mengambil riwayat pembayaran.";
      console.error("Fetch payment history error:", err);
      setPaymentHistoryData([]); // Pastikan data kosong jika error
      // Mungkin tampilkan error ini di dalam modal riwayat saja
      // Untuk sekarang, kita biarkan error global yang akan menanganinya jika modal tidak aktif
      setError(historyError); // Atau buat state error khusus untuk modal ini
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleClosePaymentHistoryModal = () => {
    setShowPaymentHistoryModal(false);
    // setPaymentHistoryData([]); // Tidak perlu dikosongkan di sini, biarkan saat dibuka lagi
    // setSelectedRoomForHistory(null); // Juga tidak perlu, karena mungkin modal upload masih butuh
    setError(null); // Bersihkan error saat modal ditutup
  };

  const handleOpenUploadPaymentModal = () => {
    if (!selectedRoomForHistory || !selectedRoomForHistory.id) {
      setUploadError(
        "Tidak ada kamar yang dipilih untuk menambah pembayaran. Silakan tutup dan buka kembali riwayat pembayaran."
      );
      setShowUploadPaymentModal(true);
      return;
    }
    setNewPaymentData({
      bulan_tagihan: "",
      jumlah_bayar: "",
      tanggal_pembayaran_lunas: "",
      status_pembayaran: "Pending Verifikasi",
      metode_pembayaran: "",
      catatan_pembayaran: "",
      buktiTransferImageFile: null,
    });
    setUploadError("");
    setUploadSuccessMessage("");
    setShowUploadPaymentModal(true);
  };

  const handleCloseUploadPaymentModal = () => {
    setShowUploadPaymentModal(false);
    setUploadError("");
    setUploadSuccessMessage("");
  };

  const handleNewPaymentInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPaymentFileChange = (e) => {
    setNewPaymentData((prev) => ({
      ...prev,
      buktiTransferImageFile: e.target.files[0],
    }));
  };

  const handleUploadPaymentSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccessMessage("");
    setUploadLoading(true);

    console.log(
      "Attempting to upload. Selected Room for Upload:",
      selectedRoomForHistory
    );
    if (!selectedRoomForHistory || !selectedRoomForHistory.id) {
      setUploadError(
        "Kamar tidak dipilih atau ID kamar tidak valid. Mohon tutup modal ini dan coba lagi dari awal."
      );
      setUploadLoading(false);
      return;
    }
    if (
      newPaymentData.status_pembayaran === "Lunas" &&
      !newPaymentData.tanggal_pembayaran_lunas
    ) {
      setUploadError('Tanggal Pelunasan wajib diisi jika status "Lunas".');
      setUploadLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("penghuni_id", selectedRoomForHistory.id);
    formData.append("bulan_tagihan", newPaymentData.bulan_tagihan);
    formData.append("jumlah_bayar", newPaymentData.jumlah_bayar);
    formData.append("status_pembayaran", newPaymentData.status_pembayaran);
    if (newPaymentData.tanggal_pembayaran_lunas)
      formData.append(
        "tanggal_pembayaran_lunas",
        newPaymentData.tanggal_pembayaran_lunas
      );
    if (newPaymentData.metode_pembayaran)
      formData.append("metode_pembayaran", newPaymentData.metode_pembayaran);
    if (newPaymentData.catatan_pembayaran)
      formData.append("catatan_pembayaran", newPaymentData.catatan_pembayaran);
    if (newPaymentData.buktiTransferImageFile)
      formData.append(
        "buktiTransferImage",
        newPaymentData.buktiTransferImageFile
      );

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan.");
      console.log("Submitting new payment data to backend..."); // DEBUG
      const response = await axios.post(
        `${API_BASE_URL}/kos/pembayaran`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("New payment submission response:", response.data); // DEBUG
      setUploadSuccessMessage("Pembayaran baru berhasil diunggah!");

      // Re-fetch data
      console.log("Re-fetching payment history after successful upload..."); // DEBUG
      await handleShowPaymentHistory(selectedRoomForHistory);
      console.log("Re-fetching all kos rooms after successful upload..."); // DEBUG
      await fetchKosRooms();

      // Also use the global success message
      setSuccessMessage("Pembayaran baru berhasil diunggah!");
      setShowSuccessModal(true);

      setTimeout(() => {
        handleCloseUploadPaymentModal();
        setShowSuccessModal(false);
      }, 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengunggah pembayaran.";
      setUploadError(errMsg);
      console.error("Upload payment error:", err.response || err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="manage-kos-page">
      <Container fluid className="py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            {" "}
            <h2 className="page-title">Manajemen Kamar Kos</h2>{" "}
          </Col>
        </Row>
        {error && !showPaymentHistoryModal && !showUploadPaymentModal && (
          <Alert variant="danger">{error}</Alert>
        )}

        <Card className="main-content-card">
          <Card.Header className="card-header-flex">
            <h5 className="card-title-custom">Daftar Kamar Kos</h5>
            <Button
              variant="primary"
              onClick={openAddModal}
              className="add-room-button"
            >
              <FaPlus /> Tambah Kamar
            </Button>
          </Card.Header>
          <Card.Body>
            {/* ... (Render Kos Rooms Cards) ... */}
            {kosRooms.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {kosRooms.map((room) => (
                  <Col key={room.id}>
                    <Card className="kos-room-card h-100">
                      {room.tenant_name && (
                        <FaInfoCircle
                          className="kos-room-payment-history-icon"
                          onClick={() => handleShowPaymentHistory(room)}
                          title="Lihat Riwayat Pembayaran"
                        />
                      )}
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="kos-room-card-title">
                          {room.room_name}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted kos-room-card-price">
                          Rp {Number(room.price).toLocaleString("id-ID")} /
                          bulan
                        </Card.Subtitle>
                        <div className="kos-room-card-facilities d-flex align-items-start">
                          <FaBed className="facility-icon me-2 mt-1" />
                          <div>
                            <strong>Fasilitas:</strong>
                            <p className="mb-0 facility-text">
                              {room.facilities || "-"}
                            </p>
                          </div>
                        </div>
                        {room.tenant_name && (
                          <div className="occupant-summary mt-2">
                            <p className="mb-1">
                              <strong>Penghuni:</strong> {room.tenant_name}
                            </p>
                            <p className="mb-1">
                              <strong>No. HP:</strong>{" "}
                              {room.tenant_phone || "-"}
                            </p>
                            <p className="mb-1">
                              <strong>Pekerjaan:</strong>{" "}
                              {room.occupation || "-"}
                            </p>
                            <p className="mb-0">
                              <strong>Status Bayar:</strong>{" "}
                              {room.payment_status_current_month ||
                                "Belum Bayar"}
                            </p>
                          </div>
                        )}
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                            <strong className="kos-room-card-availability-label">
                              Ketersediaan:
                            </strong>
                            <span
                              className={`availability-status ${
                                room.availability ? "available" : "unavailable"
                              }`}
                            >
                              {room.availability
                                ? "Tersedia"
                                : "Tidak Tersedia"}
                            </span>
                          </div>
                          <div className="action-buttons-card d-flex justify-content-end">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2 action-button-edit"
                              onClick={() => handleEdit(room)}
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-button-delete"
                              onClick={() => handleDeleteClick(room)}
                            >
                              <FaTrashAlt /> Hapus
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center no-data-message p-5">
                Belum ada data kamar kos.
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal Tambah/Edit Kamar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            {isEditing ? "Edit Kamar" : "Tambah Kamar Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <p style={{ color: "blue" }}>Kolom dengan tanda * wajib diisi</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Nama Kamar <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="room_name"
                value={currentRoom.room_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Harga (Rp) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentRoom.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Fasilitas <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="facilities"
                value={currentRoom.facilities}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Tersedia"
                name="availability"
                checked={currentRoom.availability}
                onChange={handleInputChange}
              />
            </Form.Group>
            <hr />
            <h5 className="modal-subtitle-custom">Detail Penghuni</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Penghuni</Form.Label>
                  <Form.Control
                    type="text"
                    name="tenant_name"
                    value={currentRoom.tenant_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nomor HP Penghuni</Form.Label>
                  <Form.Control
                    type="text"
                    name="tenant_phone"
                    value={currentRoom.tenant_phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Orang Tua/Wali</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_name"
                    value={currentRoom.parent_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nomor HP Orang Tua/Wali</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_phone"
                    value={currentRoom.parent_phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Pekerjaan Penghuni</Form.Label>
              <Form.Control
                type="text"
                name="occupation"
                value={currentRoom.occupation}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Pembayaran Bulan Ini</Form.Label>
              <Form.Select
                name="payment_status_current_month"
                value={currentRoom.payment_status_current_month}
                onChange={handleInputChange}
              >
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Lunas">Lunas</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Riwayat Pembayaran */}
      {selectedRoomForHistory && (
        <Modal
          show={showPaymentHistoryModal}
          onHide={handleClosePaymentHistoryModal}
          centered
          size="xl"
        >
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title className="modal-title-custom">
              Riwayat Pembayaran Kamar: {selectedRoomForHistory.room_name}{" "}
              {selectedRoomForHistory.tenant_name &&
                ` (Penghuni: ${selectedRoomForHistory.tenant_name})`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Button
              variant="success"
              onClick={handleOpenUploadPaymentModal}
              className="mb-3"
              disabled={!selectedRoomForHistory.tenant_name}
            >
              <FaUpload /> Tambah Pembayaran Baru
            </Button>
            {loadingHistory ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : paymentHistoryData.length > 0 ? (
              <Table
                striped
                bordered
                hover
                responsive
                className="payment-history-table"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bulan Tagihan</th>
                    <th>Tgl Bayar Lunas</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                    <th>Metode</th>
                    <th>Catatan</th>
                    <th>Bukti Bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistoryData.map((payment, index) => (
                    <tr key={payment.id || index}>
                      <td>{index + 1}</td>
                      <td>{payment.bulan_tagihan}</td>
                      <td>
                        {payment.tanggal_pembayaran_lunas
                          ? new Date(
                              payment.tanggal_pembayaran_lunas
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td>
                        Rp{" "}
                        {Number(payment.jumlah_bayar).toLocaleString("id-ID")}
                      </td>
                      <td>
                        <span
                          className={`payment-status-badge status-${payment.status_pembayaran
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {payment.status_pembayaran}
                        </span>
                      </td>
                      <td>{payment.metode_pembayaran || "-"}</td>
                      <td>{payment.catatan_pembayaran || "-"}</td>
                      <td>
                        {payment.bukti_transfer_path ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `${BACKEND_URL}/${payment.bukti_transfer_path}`,
                                "_blank"
                              )
                            }
                          >
                            <FaEye /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">
                {error && paymentHistoryData.length === 0
                  ? error
                  : "Belum ada riwayat pembayaran untuk kamar ini."}
              </p>
            )}{" "}
            {/* Tampilkan error jika ada dan data kosong */}
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button
              variant="outline-secondary"
              onClick={handleClosePaymentHistoryModal}
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Upload Pembayaran Baru */}
      {selectedRoomForHistory && (
        <Modal
          show={showUploadPaymentModal}
          onHide={handleCloseUploadPaymentModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title className="modal-title-custom">
              Upload Pembayaran Baru untuk Kamar:{" "}
              {selectedRoomForHistory.room_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            {uploadError && <Alert variant="danger">{uploadError}</Alert>}
            {uploadSuccessMessage && (
              <Alert variant="success">{uploadSuccessMessage}</Alert>
            )}
            <Form
              onSubmit={handleUploadPaymentSubmit}
              encType="multipart/form-data"
            >
              <Form.Group className="mb-3">
                <Form.Label>Nama Penghuni</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    selectedRoomForHistory.tenant_name ||
                    "Kamar ini belum ada penghuni"
                  }
                  disabled
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bulan Tagihan (YYYY-MM)*</Form.Label>
                    <Form.Control
                      type="month"
                      name="bulan_tagihan"
                      value={newPaymentData.bulan_tagihan}
                      onChange={handleNewPaymentInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Jumlah Pembayaran (Rp)*</Form.Label>
                    <Form.Control
                      type="number"
                      name="jumlah_bayar"
                      value={newPaymentData.jumlah_bayar}
                      onChange={handleNewPaymentInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status Pembayaran*</Form.Label>
                    <Form.Select
                      name="status_pembayaran"
                      value={newPaymentData.status_pembayaran}
                      onChange={handleNewPaymentInputChange}
                      required
                    >
                      <option value="Pending Verifikasi">
                        Pending Verifikasi
                      </option>
                      <option value="Lunas">Lunas</option>
                      <option value="Belum Bayar">Belum Bayar</option>
                      <option value="Ditolak">Ditolak</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Tanggal Pembayaran Lunas (jika Lunas)
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="tanggal_pembayaran_lunas"
                      value={newPaymentData.tanggal_pembayaran_lunas}
                      onChange={handleNewPaymentInputChange}
                      disabled={newPaymentData.status_pembayaran !== "Lunas"}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Metode Pembayaran</Form.Label>
                <Form.Control
                  type="text"
                  name="metode_pembayaran"
                  value={newPaymentData.metode_pembayaran}
                  onChange={handleNewPaymentInputChange}
                  placeholder="e.g., Transfer BCA, Tunai"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Gambar Bukti Pembayaran</Form.Label>
                <Form.Control
                  type="file"
                  name="buktiTransferImageFile"
                  accept="image/*"
                  onChange={handleNewPaymentFileChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Catatan Pembayaran</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="catatan_pembayaran"
                  value={newPaymentData.catatan_pembayaran}
                  onChange={handleNewPaymentInputChange}
                />
              </Form.Group>
              <Modal.Footer className="modal-footer-custom">
                <Button
                  variant="outline-secondary"
                  onClick={handleCloseUploadPaymentModal}
                  disabled={uploadLoading}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    uploadLoading || !selectedRoomForHistory.tenant_name
                  }
                >
                  {uploadLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Mengunggah...
                    </>
                  ) : (
                    "Unggah Pembayaran"
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            Konfirmasi Hapus Kamar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          Apakah Anda yakin ingin menghapus kamar "{roomToDelete?.room_name}"?
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </Modal.Footer>{" "}
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="success-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="success-checkmark-container">
            <FaCheckCircle className="success-checkmark-icon" />
          </div>
          <h4 className="mt-3">{successMessage}</h4>
        </Modal.Body>
      </Modal>
      {/* Footer dihapus karena sudah dihandle oleh Dashboard */}
    </div>
  );
};

export default ManageKos;
