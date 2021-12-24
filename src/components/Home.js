import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/action";

const Home = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const state = useSelector((state) => state?.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("users")
      .doc(state?.uid)
      .get()
      .then((res) => {
        setUserData(res.data());
      })
      .catch((err) => console.log(err));
  }, []);
  const logout = () => {
    auth
      .signOut()
      .then((res) => {
        dispatch(logoutUser());
        toast.success("Logout Successfully..");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mt-4">
        <h1 className="text-center">Welocme to home</h1>
        <button className="btn btn-dark" onClick={logout}>
          Logout
        </button>
      </div>
      <h2 className="mt-4 text-end">Credit: ${userData?.credit}</h2>

      <div style={{ background: "#ddd", padding: "10px", marginTop: "1rem" }}>
        Share Your Refer Link: {userData?.refId}
      </div>
    </div>
  );
};

export default Home;
