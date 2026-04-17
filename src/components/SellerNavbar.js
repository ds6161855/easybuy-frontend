import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

const SellerNavbar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [seller, setSeller] = useState(null);

  // ✅ FIXED SELLER LOAD
  const loadSeller = () => {
    try {
      const storedSeller = localStorage.getItem("seller");
  
      if (!storedSeller || storedSeller === "undefined") {
        setSeller(null);
        return;
      }
  
      const parsed = JSON.parse(storedSeller);
  
      if (!parsed) {
        setSeller(null);
        return;
      }
      setSeller(parsed);
    } catch {
      setSeller(null);
    }
  };

  useEffect(() => {
    loadSeller();
  
    const handleChange = () => {
      loadSeller();
    };
  
    window.addEventListener("sellerChanged", handleChange);
  
    return () => {
      window.removeEventListener("sellerChanged", handleChange);
    };
  }, []);

  useEffect(() => {
    console.log("SELLER NAVBAR UPDATED:", seller);
  }, [seller]);

  useEffect(() => {
    loadSeller();
  }, [window.location.pathname]);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/seller/search?query=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem("seller");

    setSeller(null);
    window.dispatchEvent(new Event("sellerChanged"));

    navigate("/seller/login");
  };

  // ✅ MENU ROUTES FIXED
  const menuItems = [
    { label: "Dashboard", path: "/seller/dashboard" },
    { label: "Add Product", path: "/seller/add-product" },
    { label: "Orders", path: "/seller/orders" },
    { label: "Earnings", path: "/seller/earnings" },
  ];

  

  return (
    <Box>

      {/* 🔥 TOP NAVBAR */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#2874f0", py: 0.5, px: 2 }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LOGO */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/seller/dashboard")}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: 22, color: "#fff" }}>
              EasyBuy
            </Typography>

            <Typography sx={{ ml: 1, fontSize: 12, color: "#ffe500", fontWeight: 600 }}>
              Seller
            </Typography>
          </Box>

          {/* SEARCH */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 600,
              mx: 3,
              display: "flex",
              backgroundColor: "#fff",
              borderRadius: 1,
              alignItems: "center",
              px: 1,
              height: 36,
            }}
          >
            <InputBase
              placeholder="Search your products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon sx={{ color: "#2874f0" }} />
            </IconButton>
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

            {!seller ? (
              <>
                <Button
                  sx={{ backgroundColor: "#fff", color: "#2874f0" }}
                  onClick={() => navigate("/seller/login")}
                >
                  Login
                </Button>

                <Button
                  sx={{ color: "#fff" }}
                  onClick={() => navigate("/seller/register")}
                >
                  New Seller Register
                </Button>
              </>
            ) : (
              <>
                {/* PROFILE BUTTON */}
                <Button
                  onClick={(e) => setAccountAnchorEl(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  {seller?.name ?? "Seller"}
                </Button>

                {/* DROPDOWN */}
                <Menu
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={() => setAccountAnchorEl(null)}
                >
                  {/* 🔥 SELLER INFO */}
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight="bold">
                      {seller?.name}
                    </Typography>
                    <Typography fontSize={12}>
                      {seller?.email}
                    </Typography>
                    <Typography fontSize={12}>
                      {seller?.phone}
                    </Typography>
                  </Box>

                  <Divider />

                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        setAccountAnchorEl(null);
                        navigate(item.path);
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      setAccountAnchorEl(null);
                      handleLogout();
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* MORE MENU */}
            <Button
        sx={{ color: "#fff" }}
        onClick={(e) => setMoreAnchorEl(e.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
      >
        More
      </Button>

      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={() => setMoreAnchorEl(null)}
      >
        <MenuItem onClick={() => navigate("/seller/help")}>
          Seller Help
        </MenuItem>
        <MenuItem onClick={() => navigate("/seller/support")}>
          Support
        </MenuItem>
        <MenuItem onClick={() => navigate("/seller/settings")}>
          Settings
        </MenuItem>
      </Menu>

          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔥 SECOND BAR */}
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#fff",
          px: 3,
          py: 1,
          gap: 6,
          fontWeight: 600,
          borderBottom: "1px solid #ddd",
          overflowX: "auto"
        }}
      >
     
      </Box>

    </Box>
  );
};

export default SellerNavbar;