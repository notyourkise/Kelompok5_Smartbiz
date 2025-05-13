import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  Card,
  Dropdown,
  Button,
  Spinner,
} from "react-bootstrap"; // Tambahkan Spinner
import {
  FaTachometerAlt,
  FaDollarSign,
  FaBed,
  FaCoffee,
  FaUser,
  FaBox,
  FaSignOutAlt,
  FaUserCircle,
  FaFilter,
  FaWarehouse,
  FaStore,
  FaExclamationCircle,
  FaInfoCircle,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope, // Tambahkan ikon baru
  FaMoon, // Ikon untuk dark mode
  FaSun, // Ikon untuk light mode
  FaChevronDown, // Icon for dropdown
  FaChevronUp, // Icon for dropdown
} from "react-icons/fa";
import axios from "axios";
import Footer from "./Footer";
import ManageUser from "./ManageUser"; // Impor ManageUser
import ManageKos from "./ManageKos"; // Impor ManageKos
import ManageCoffeeShopMenu from "./ManageCoffeeShopMenu"; // Impor ManageCoffeeShopMenu
import ManageInventarisCoffeeShop from "./ManageInventarisCoffeeShop"; // Import Inventaris Coffee Shop
import ManageInventarisKost from "./ManageInventarisKost"; // Import Inventaris Kost
import "./Dashboard.css"; // Pastikan CSS diimpor

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); // State for inventory dropdown
  const [isFinanceOpen, setIsFinanceOpen] = useState(false); // State for finance dropdown
  const [theme, setTheme] = useState("dark"); // 'light' or 'dark'
  const [timeFilter, setTimeFilter] = useState("thisMonth"); // Default filter
  const [currentTimeString, setCurrentTimeString] = useState("");

  // Helper function to apply date filtering on the frontend
  const getFilteredTransactionsByDate = (transactions, filterType) => {
    if (!Array.isArray(transactions)) return [];
    const now = new Date();
    let startDate = new Date(now); // Initialize startDate
    let endDate = new Date(now);   // Initialize endDate

    endDate.setHours(23, 59, 59, 999); // End of current day for all filters

    switch (filterType) {
      case "today":
        startDate.setHours(0, 0, 0, 0); // Start of current day
        break;
      case "last7days":
        startDate.setDate(now.getDate() - 6); // Today and previous 6 days
        startDate.setHours(0, 0, 0, 0);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
        startDate.setHours(0, 0, 0, 0);
        // endDate remains end of current day
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1); // First day of current year
        startDate.setHours(0, 0, 0, 0);
        // endDate remains end of current day
        break;
      default:
        // If filterType is 'allTime' or unknown, or if no case matches, return an empty array.
        console.warn(`Unhandled filterType in getFilteredTransactionsByDate: ${filterType}`);
        return []; 
    }

    return transactions.filter(t => {
      if (!t.created_at || typeof t.created_at !== 'string') {
        // console.warn('Invalid or missing created_at for transaction:', t);
        return false;
      }
      
      // Robust date parsing for "YYYY-MM-DD HH:MM:SS" format
      let transactionDate;
      const dateTimeParts = t.created_at.split(" ");
      if (dateTimeParts.length === 2) {
        const dateParts = dateTimeParts[0].split("-");
        const timeParts = dateTimeParts[1].split(":");
        if (dateParts.length === 3 && timeParts.length === 3) {
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-indexed
          const day = parseInt(dateParts[2], 10);
          const hour = parseInt(timeParts[0], 10);
          const minute = parseInt(timeParts[1], 10);
          const second = parseInt(timeParts[2], 10);
          
          // Check if all parts are valid numbers
          if (![year, month, day, hour, minute, second].some(isNaN)) {
            transactionDate = new Date(year, month, day, hour, minute, second);
          }
        }
      }

      if (!transactionDate || isNaN(transactionDate.getTime())) {
        // console.warn('Failed to parse created_at string to valid date:', t.created_at, t);
        return false; // If date is invalid or parsing failed, exclude it
      }
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [stats, setStats] = useState({
    totalUsers: null,
    monthlyIncome: "Rp 0", // Initialize to Rp 0 for clearer debugging
    monthlyExpense: "Rp 0", // Initialize to Rp 0 for clearer debugging
    availableRooms: null,
    menuItems: null,
    loading: true,
    error: null,
  });

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // useEffect to apply theme class to body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme-body");
    } else {
      document.body.classList.remove("dark-theme-body");
    }
    // Cleanup function to remove the class when the component unmounts or theme changes to light
    return () => {
      document.body.classList.remove("dark-theme-body");
    };
  }, [theme]);

  // Toggle inventory dropdown
  const toggleInventoryDropdown = () => {
    setIsInventoryOpen(!isInventoryOpen);
  };

  // Toggle finance dropdown
  const toggleFinanceDropdown = () => {
    setIsFinanceOpen(!isFinanceOpen);
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        weekday: 'long', // "Senin"
        day: 'numeric', // "10"
        month: 'long', // "Mei"
        year: 'numeric', // "2025"
        hour: '2-digit', // "23"
        minute: '2-digit', // "58"
        timeZone: 'Asia/Makassar', // WITA
        hour12: false, // Use 24-hour format
      };
      setCurrentTimeString(now.toLocaleString('id-ID', options).replace(/\./g, ':')); // Replace dots with colons for time
    };

    updateClock(); // Initial call to set the clock immediately
    const intervalId = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token"); // Ambil token

  // --- Fetch Statistik ---
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Autentikasi tidak ditemukan.",
        }));
        return;
      }

      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const userEndpoint = "http://localhost:3001/api/users";
        const roomEndpoint = "http://localhost:3001/api/kos";
        const menuEndpoint = "http://localhost:3001/coffee-shop/menus";
        const allFinanceEndpoint = "http://localhost:3001/keuangan/detail"; // Fetch ALL finance data

        const results = await Promise.allSettled([
          axios.get(userEndpoint, config),        // 0: userResult
          axios.get(roomEndpoint, config),        // 1: roomResult
          axios.get(menuEndpoint, config),        // 2: menuResult
          axios.get(allFinanceEndpoint, config)   // 3: allFinanceResult
        ]);

        const userResult = results[0];
        const roomResult = results[1];
        const menuResult = results[2];
        const allFinanceResult = results[3]; // Renamed for clarity

        let totalUsers = "Error";
        if (userResult.status === 'fulfilled' && Array.isArray(userResult.value.data)) {
          totalUsers = userResult.value.data.length;
        } else if (userResult.status === 'rejected') {
          console.error("Error fetching users:", userResult.reason);
        }

        let menuItems = "Error";
        if (menuResult.status === 'fulfilled' && Array.isArray(menuResult.value.data)) {
          menuItems = menuResult.value.data.length;
        } else if (menuResult.status === 'rejected') {
          console.error("Error fetching menu items:", menuResult.reason);
        }

        let availableRooms = "Error";
        if (roomResult.status === 'fulfilled' && Array.isArray(roomResult.value.data)) {
          try {
            availableRooms = roomResult.value.data.filter(
              (room) => String(room.availability).toLowerCase() === "true"
            ).length;
          } catch (filterError) {
            console.error("Error filtering rooms:", filterError);
          }
        } else if (roomResult.status === 'rejected') {
          console.error("Error fetching rooms:", roomResult.reason);
        }


        let rawKostFinanceData = [];
        let rawCoffeeFinanceData = [];
        let financeDataError = false;

        if (allFinanceResult.status === 'fulfilled' && Array.isArray(allFinanceResult.value.data)) {
          const allTransactions = allFinanceResult.value.data;
          rawKostFinanceData = allTransactions.filter(t =>
            t.category && (
              t.category.toLowerCase() === "kost" ||
              t.category.toLowerCase() === "pendapatan kos" ||
              t.category.toLowerCase() === "pengeluaran kos"
            )
          );
          rawCoffeeFinanceData = allTransactions.filter(t =>
            t.category && t.category.toLowerCase() === "coffee shop"
          );
        } else if (allFinanceResult.status === 'rejected') {
          console.error("Error fetching All finance data:", allFinanceResult.reason);
          financeDataError = true;
        }

        // Apply frontend date filtering based on timeFilter state
        const filteredKostData = getFilteredTransactionsByDate(rawKostFinanceData, timeFilter);
        const filteredCoffeeData = getFilteredTransactionsByDate(rawCoffeeFinanceData, timeFilter);
        
        let calculatedFilteredIncome = financeDataError ? "Error" : "Rp 0";
        if (!financeDataError) {
          try {
            const kostTransactionsIncome = filteredKostData.filter(t => t.type === "income");
            const coffeeTransactionsIncome = filteredCoffeeData.filter(t => t.type === "income");
            const totalFilteredIncome = [...kostTransactionsIncome, ...coffeeTransactionsIncome]
              .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
            calculatedFilteredIncome = new Intl.NumberFormat("id-ID", {
              style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0,
            }).format(totalFilteredIncome);
          } catch (calcError) {
            console.error("Error calculating filtered income for dashboard:", calcError);
            calculatedFilteredIncome = "Error";
          }
        }

        let calculatedFilteredExpense = financeDataError ? "Error" : "Rp 0";
        if (!financeDataError) {
          try {
            const kostTransactionsExpense = filteredKostData.filter(t => t.type === "expense");
            const coffeeTransactionsExpense = filteredCoffeeData.filter(t => t.type === "expense");
            const totalFilteredExpense = [...kostTransactionsExpense, ...coffeeTransactionsExpense]
              .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
            calculatedFilteredExpense = new Intl.NumberFormat("id-ID", {
              style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0,
            }).format(totalFilteredExpense);
          } catch (calcError) {
            console.error("Error calculating filtered expense for dashboard:", calcError);
            calculatedFilteredExpense = "Error";
          }
        }

        // Check if all primary data sources failed, to set a general error message
        const criticalDataFailed = userResult.status === 'rejected' && 
                                   roomResult.status === 'rejected' && 
                                   menuResult.status === 'rejected' &&
                                   allFinanceResult.status === 'rejected'; 
        
        setStats({
          totalUsers,
          monthlyIncome: calculatedFilteredIncome,
          monthlyExpense: calculatedFilteredExpense,
          availableRooms,
          menuItems,
          loading: false,
          error: criticalDataFailed ? "Gagal mengambil sebagian data statistik penting." : (financeDataError ? "Gagal mengambil data keuangan." : null),
        });

      } catch (err) {
        // This catch is for errors outside the Promise.allSettled scope, e.g., setup errors
        console.error("Outer error in fetchStats setup:", err);
        setStats((prev) => ({
          ...prev,
          totalUsers: "Error", availableRooms: "Error", menuItems: "Error",
          monthlyIncome: "Error", monthlyExpense: "Error", // Keep existing values or set to Error
          loading: false, error: "Terjadi kesalahan saat memuat data.",
        }));
      }
    };

    if (activeView === "dashboard") {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, token, timeFilter]); // Re-fetch if activeView, token, or timeFilter changes

  // --- Fungsi Navigasi ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleCoffeeShopFinanceClick = () => navigate("/finance/coffee-shop"); // Keep navigation for finance for now, unless specified otherwise
  const handleKostFinanceClick = () => navigate("/finance/kost"); // Keep navigation for finance for now
  const handleManageUser = () => setActiveView("manageUser");
  const handleManageKos = () => setActiveView("manageKos");
  const handleManageCoffeeShopMenu = () => setActiveView("manageCoffeeShopMenu"); // Diubah untuk mengatur activeView
  const handleAboutClick = () => setActiveView("about"); // Handler for About menu

  // --- Render Konten ---
  const renderMainContent = () => {
    switch (activeView) {
      case "finance":
        // ... (Konten sub-menu finance tetap sama)
        return (
          <>
            <h3>Manajemen Keuangan</h3>
            <Row xs={1} md={2} className="g-4">
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaStore className="card-icon-modern" />
                    <Card.Title>Coffee Shop</Card.Title>
                    <Card.Text>Kelola keuangan Coffee Shop.</Card.Text>
                    <Button
                      variant="success"
                      onClick={handleCoffeeShopFinanceClick}
                    >
                      Kelola
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaBed className="card-icon-modern" />
                    <Card.Title>Kost</Card.Title>
                    <Card.Text>Kelola keuangan Kost.</Card.Text>
                    <Button variant="success" onClick={handleKostFinanceClick}>
                      Kelola
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
      // REMOVED 'inventory' case
      case "about":
        return (
          <>
            <h3>Tentang SmartbizAdmin</h3>
            <Card className="dashboard-card-modern about-card">
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title>
                      <FaInfoCircle className="card-icon-modern" />{" "}
                      SmartbizAdmin
                    </Card.Title>
                    <Card.Text>
                      SmartbizAdmin adalah solusi manajemen bisnis terpadu yang
                      dirancang untuk membantu Anda mengelola operasional Kost
                      dan Coffee Shop dengan lebih efisien. Kami menyediakan
                      berbagai fitur untuk mempermudah pengelolaan keuangan,
                      inventaris, pengguna, dan layanan lainnya.
                    </Card.Text>
                    <hr />
                    <h5>Hubungi Kami:</h5>
                    <div className="contact-info">
                      <p>
                        <FaWhatsapp className="whatsapp-icon" />{" "}
                        <a
                          href="https://wa.me/6285651384990"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          +62 856-5138-4990
                        </a>
                      </p>
                      <p>
                        <FaInstagram className="instagram-icon" />{" "}
                        <a
                          href="https://instagram.com/muhamaadd.fikrriii"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @muhamaadd.fikrriii
                        </a>
                      </p>
                      <p>
                        <FaEnvelope className="email-icon" />{" "}
                        <a href="haikalariadma07@gmail.com">
                          haikalariadma07@gmail.com
                        </a>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        );
      case "manageUser":
        return <ManageUser />;
      case "manageKos":
        return <ManageKos />;
      case "manageCoffeeShopMenu":
        return <ManageCoffeeShopMenu theme={theme} />;
      case "manageInventarisCoffeeShop": // Add case for Coffee Shop Inventory
        return <ManageInventarisCoffeeShop />;
      case "manageInventarisKost": // Add case for Kost Inventory
        return <ManageInventarisKost />;
      case "dashboard":
      default:
        // Helper untuk render nilai statistik (handle loading & error)
        const renderStatValue = (valueKey) => {
          const value = stats[valueKey];
          if (stats.loading) return <Spinner animation="border" size="sm" />;
          // Tampilkan error jika value spesifik adalah 'Error' ATAU jika ada error global fetch
          if (
            value === "Error" ||
            (stats.error && valueKey !== "monthlyIncome")
          ) {
            // Jangan tunjukkan error global di income jika income sendiri berhasil dihitung
            return (
              <FaExclamationCircle
                className="text-danger"
                title={stats.error || "Gagal memuat data"}
              />
            );
          }
          if (value === null) return "-"; // Tampilkan '-' jika null setelah loading selesai
          return value; // Tampilkan nilai jika valid
        };
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Ringkasan Statistik</h3>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-filter"
                  size="sm"
                >
                  <FaFilter /> {
                    {
                      "today": "Hari Ini",
                      "last7days": "7 Hari Terakhir",
                      "thisMonth": "Bulan Ini",
                      "thisYear": "Tahun Ini"
                    }[timeFilter] || "Filter Waktu"
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleTimeFilterChange("today")} active={timeFilter === "today"}>
                    Hari Ini
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTimeFilterChange("last7days")} active={timeFilter === "last7days"}>
                    7 Hari Terakhir
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTimeFilterChange("thisMonth")} active={timeFilter === "thisMonth"}>
                    Bulan Ini
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTimeFilterChange("thisYear")} active={timeFilter === "thisYear"}>
                    Tahun Ini
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {stats.error && (
              <div className="alert alert-danger">{stats.error}</div>
            )}
            <Row xs={1} md={2} lg={3} className="g-4">
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-primary">
                      <FaUser />
                    </div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">
                        Total Pengguna
                      </Card.Subtitle>
                      <Card.Title className="widget-value">
                        {renderStatValue("totalUsers")}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-success">
                      <FaDollarSign />
                    </div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">
                        Pendapatan 
                      </Card.Subtitle>
                      <Card.Title className="widget-value">
                        {stats.loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : stats.monthlyIncome === "Error" || (stats.error && !stats.monthlyIncome && !stats.monthlyExpense) ? ( // Adjusted error condition
                          <FaExclamationCircle
                            className="text-danger"
                            title={stats.error || "Gagal menghitung pendapatan"}
                          />
                        ) : (
                          stats.monthlyIncome ?? "-" // monthlyIncome now holds filtered income
                        )}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-danger">
                      <FaDollarSign />
                    </div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">
                        Pengeluaran 
                      </Card.Subtitle>
                      <Card.Title className="widget-value">
                        {stats.loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : stats.monthlyExpense === "Error" || (stats.error && !stats.monthlyIncome && !stats.monthlyExpense) ? ( // Adjusted error condition
                          <FaExclamationCircle
                            className="text-danger"
                            title={stats.error || "Gagal menghitung pengeluaran"}
                          />
                        ) : (
                          stats.monthlyExpense ?? "-" // monthlyExpense now holds filtered expense
                        )}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-info">
                      <FaBed />
                    </div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">
                        Kamar Tersedia
                      </Card.Subtitle>
                      <Card.Title className="widget-value">
                        {renderStatValue("availableRooms")}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-warning">
                      <FaCoffee />
                    </div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">
                        Item Menu Kopi
                      </Card.Subtitle>
                      <Card.Title className="widget-value">
                        {renderStatValue("menuItems")}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  // --- Render Komponen Utama ---
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Nav className="flex-column sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Smartbiz</h2>
        </div>
        {/* Dashboard Link */}
        <Nav.Link
          onClick={() => setActiveView("dashboard")}
          active={activeView === "dashboard"}
        >
          <FaTachometerAlt className="sidebar-icon icon-dashboard" /> Dashboard
        </Nav.Link>

        {/* Finance Dropdown (Superadmin only) */}
        {role === "superadmin" && (
          <>
            <Nav.Link 
              onClick={toggleFinanceDropdown} 
              className="d-flex justify-content-between align-items-center"
              // active={activeView === "financeCoffeeShop" || activeView === "financeKost"} // Optional: highlight main if sub is active
            >
              <span>
                <FaDollarSign className="sidebar-icon icon-finance" /> Manajemen Keuangan
              </span>
              {isFinanceOpen ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {isFinanceOpen && (
              <Nav className="flex-column ms-3 sub-menu">
                <Nav.Link 
                  onClick={() => { setActiveView("financeCoffeeShop"); handleCoffeeShopFinanceClick(); }}
                  active={activeView === "financeCoffeeShop"}
                >
                  <FaStore className="sidebar-icon sub-icon" /> Keuangan Coffee Shop
                </Nav.Link>
                <Nav.Link 
                  onClick={() => { setActiveView("financeKost"); handleKostFinanceClick(); }}
                  active={activeView === "financeKost"}
                >
                  <FaBed className="sidebar-icon sub-icon" /> Keuangan Kost
                </Nav.Link>
              </Nav>
            )}
          </>
        )}
        {/* End Finance Dropdown */}

        {/* Manage Kos Link (Superadmin only) */}
        {role === "superadmin" && (
          <Nav.Link onClick={handleManageKos} active={activeView === "manageKos"}>
            <FaBed className="sidebar-icon icon-kos" /> Manajemen Kamar Kos
          </Nav.Link>
        )}

        {/* Coffee Shop Menu Link */}
        <Nav.Link onClick={handleManageCoffeeShopMenu} active={activeView === "manageCoffeeShopMenu"}>
          <FaCoffee className="sidebar-icon icon-coffee" /> Coffee Shop Menu
        </Nav.Link>

        {/* Manage User Link (Superadmin only) */}
        {role === "superadmin" && (
          <Nav.Link onClick={handleManageUser} active={activeView === "manageUser"}>
            <FaUser className="sidebar-icon icon-user" /> Manajemen User
          </Nav.Link>
        )}

        {/* Inventory Dropdown (Superadmin only) */}
        {role === "superadmin" && (
          <>
            <Nav.Link onClick={toggleInventoryDropdown} className="d-flex justify-content-between align-items-center inventory-toggle">
              <span>
                <FaBox className="sidebar-icon icon-inventory" /> Inventaris
              </span>
              {isInventoryOpen ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {isInventoryOpen && (
              <Nav className="flex-column ms-3 sub-menu"> {/* Indentation for sub-menu */}
                <Nav.Link onClick={() => setActiveView("manageInventarisCoffeeShop")} active={activeView === "manageInventarisCoffeeShop"}>
                  <FaStore className="sidebar-icon sub-icon" /> Coffee Shop
                </Nav.Link>
                <Nav.Link onClick={() => setActiveView("manageInventarisKost")} active={activeView === "manageInventarisKost"}>
                  <FaWarehouse className="sidebar-icon sub-icon" /> Kost
                </Nav.Link>
              </Nav>
            )}
          </>
        )}
        {/* End Inventory Dropdown */}

        {/* About Us Link */}
        <Nav.Link onClick={handleAboutClick} active={activeView === "about"}>
          <FaInfoCircle className="sidebar-icon icon-about" /> Tentang Kami
        </Nav.Link>

      </Nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header within Main Content */}
        <header className="main-header">
          <div className="header-welcome">
            {/* Tampilkan pesan selamat datang hanya jika username ada */}
            {username && (
              <h3 className="welcome-message">Selamat Datang, {username}!</h3>
            )}
            {role && <h5 className="role-display">Role: {role}</h5>}
          </div>
          {/* Clock, Theme Toggle, and User Dropdown */}
          <div className="header-actions d-flex align-items-center">
            <div className="clock-display me-3"> {/* Added me-3 for margin */}
              {currentTimeString}
            </div>
            <Button
              variant="link"
              onClick={toggleTheme}
              className="theme-toggle-btn p-0 me-3" // p-0 to remove padding, me-3 for margin
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              style={{ background: 'none', border: 'none' }} // Ensure button itself is transparent
            >
              {theme === "light" ? (
                <FaMoon size={24} className="theme-icon" /> // Class for specific styling
              ) : (
                <FaSun size={24} className="theme-icon" /> // Class for specific styling
              )}
            </Button>
            <Dropdown align="end" className="user-dropdown-modern">
              <Dropdown.Toggle variant="link" id="dropdown-user-modern" className="p-0 profile-dropdown-toggle">
                <FaUserCircle size={30} className="profile-icon"/> {/* Class for specific styling */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                onClick={() => console.log("Navigate to Profile page...")}
              >
                <FaUserCircle className="dropdown-icon" /> Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div> {/* Closing tag for header-actions */}
        </header>

        {/* Dynamic Content */}
        <div className="content-area">{renderMainContent()}</div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
