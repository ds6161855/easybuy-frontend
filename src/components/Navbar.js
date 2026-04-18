import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowDropDownIcon from "@mui/icons-material/KeyboardArrowDown"; // ✅ better arrow
import AccountCircleIcon from "@mui/icons-material/PersonOutline"; // ✅ cleaner profile
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"; // ✅ orders icon
import TranslateIcon from "@mui/icons-material/Translate"; // ✅ language icon
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined"; // ✅ privacy
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"; // ✅ terms

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Navbar = () => {
  
const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  

  const menuItems = [
    { label: "Notification Preferences", path: "/NotificationPreferences" },
    { label: "24x7 Customer Care", path: "/CustomerCare" },
    { label: "Advertise", path: "/Advertise" },
    { label: "Download App", path: "/DownloadApp" },
  ];

  const categories = [
    "Electronics",
    "TVs & Appliances",
    "Men",
    "Women",
    "Baby & Kids",
    "Home & Furniture",
    "Sports, Books & More",
    "Flights",
    "Offer Zone",
  ];

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
  
      if (!storedUser || storedUser === "undefined") {
        setUser(null);
        return;
      }
  
      const parsedUser = JSON.parse(storedUser);
  
      // ✅ extra safety
      if (!parsedUser || !parsedUser.id) {
        setUser(null);
        return;
      }
  
      setUser(parsedUser);
    } catch (err) {
      console.error("USER PARSE ERROR:", err);
      setUser(null);
    }
  };


  useEffect(() => {
    loadUser();          // ✅ user load
    loadCartCount();     // ✅ cart count load

    const sellerPhone = localStorage.getItem("sellerPhone");
  if (sellerPhone) {
    setSeller({ phone: sellerPhone });
  }
  
    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("userChanged", loadUser); // ✅ important
  
    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);;

  const handleMoreClick = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleAccountOpen = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/Serach?query=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const getUserOrGuestId = () => {
    let userId = localStorage.getItem("userId");
  
    if (userId && userId !== "null" && userId !== "undefined") {
      return userId;
    }
  
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "GUEST_" + Date.now();
      localStorage.setItem("guestId", guestId);
    }
  
    return guestId;
  };

  const loadCartCount = () => {
    const id = getUserOrGuestId();
  
    fetch(`https://easybuy-backend-xadk.onrender.com/api/cart/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject()) // ✅ FIX
      .then(data => {
        if (Array.isArray(data)) {
          setCartCount(data.length);
        } else if (Array.isArray(data.items)) {
          setCartCount(data.items.length);
        } else if (Array.isArray(data.data)) {
          setCartCount(data.data.length);
        } else {
          setCartCount(0);
        }
      })
      .catch(() => setCartCount(0));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  
    setUser(null);
    setCartCount(0);
  
    window.dispatchEvent(new Event("userChanged"));
    window.dispatchEvent(new Event("cartUpdated")); // ✅ ADD THIS
  
    navigate("/");
  };

  return (
    <Box>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#2874f0", paddingY: 0.5, px: 2, zIndex: 1301 }}
        elevation={0}
      >
        <Toolbar
          sx={{
            minHeight: 40,
            display: "flex",
            justifyContent: "space-between",
            px: 0,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", letterSpacing: 1, fontSize: 22, color: "#fff" }}
            >
              EasyBuy
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              maxWidth: 600,
              marginLeft: 3,
              display: "flex",
              backgroundColor: "#fff",
              borderRadius: 1,
              alignItems: "center",
              paddingX: 1,
              height: 36,
            }}
          >
            <InputBase
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <IconButton sx={{ color: "#2874f0" }} onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 3 }}>
          {seller ? (
            <>
            <Button
              sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
              onClick={() => navigate("/seller/dashboard")}
            >
              Seller Panel
            </Button>
          
            <Button
              sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
              onClick={() => {
                localStorage.removeItem("sellerPhone");
                setSeller(null);
                navigate("/");
              }}
            >
              Logout
            </Button>
          </> ) : user ? (
              <>
                <Button
                  sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
                  onClick={handleAccountOpen}
                  endIcon={<ArrowDropDownIcon />}
                >
                  {user.name || "User"}
                </Button>

                <Menu
  anchorEl={accountAnchorEl}
  open={Boolean(accountAnchorEl)}
  onClose={handleAccountClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "right" }}
  PaperProps={{
    sx: {
      width: 250,
      borderRadius: 2,
      mt: 1,       // ✅ thoda gap AppBar se
      zIndex: 1400 // ✅ ensure it appears above everything
    }
  }}
>
<MenuItem onClick={() => { handleAccountClose(); navigate("/MyProfile"); }}>
  <AccountCircleIcon sx={{ mr: 1 }} /> My Profile
</MenuItem>

<MenuItem onClick={() => { handleAccountClose(); navigate("/order"); }}>
  <Inventory2OutlinedIcon sx={{ mr: 1 }} /> Orders
</MenuItem>

<MenuItem onClick={() => { handleAccountClose(); navigate("/Wallet"); }}>
  <CreditCardIcon sx={{ mr: 1 }} /> Saved Cards & Wallet
</MenuItem>

<MenuItem onClick={() => { handleAccountClose(); navigate("/Language"); }}>
  <TranslateIcon sx={{ mr: 1 }} /> Select Language
</MenuItem>

<MenuItem onClick={() => { handleAccountClose(); navigate("/Privacy"); }}>
  <PolicyOutlinedIcon sx={{ mr: 1 }} /> Privacy Center
</MenuItem>

<MenuItem onClick={() => { handleAccountClose(); navigate("/Terms"); }}>
  <DescriptionOutlinedIcon sx={{ mr: 1 }} /> Terms & Policies
</MenuItem>

<Divider />

<MenuItem onClick={() => { handleAccountClose(); handleLogout(); }}>
  <LogoutIcon sx={{ mr: 1 }} /> Logout
</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    color: "#2874f0",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
                  onClick={() => navigate("/seller/login")}
                >
                  Become a Seller
                </Button>
              </>
            )}

            <Button
              sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
              onClick={handleMoreClick}
              endIcon={<ArrowDropDownIcon />}
            >
              More
            </Button>

            <Menu
              anchorEl={moreAnchorEl}
              open={Boolean(moreAnchorEl)}
              onClose={handleMoreClose}
            >
              {menuItems.map(({ label, path }) => (
                <MenuItem
                  key={label}
                  onClick={() => {
                    handleMoreClose();
                    navigate(path);
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </Menu>

            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => navigate("/cart")}
            >
              <Badge badgeContent={cartCount} color="error">
  <ShoppingCartIcon />
</Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          backgroundColor: "#fff",
          paddingY: 1,
          px: 3,
          gap: 16,
          fontSize: 14,
          fontWeight: 600,
          borderBottom: "1px solid #ddd",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {categories.map((cat) => (
          <Box
            key={cat}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": { color: "#2874f0" },
            }}
            onClick={() => {
              const urlPath = cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
              navigate(`/category/${urlPath}`);
            }}
          >
            {cat}
            <ArrowDropDownIcon fontSize="small" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Navbar;
