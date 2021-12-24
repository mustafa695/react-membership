import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../config/firebase";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserData } from "../store/action";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const loginUser = (data) => {
    setLoader(true)
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then((userCredential) => {
        let user = userCredential.user;

        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            dispatch(loginUserData({ ...doc.data(), id: doc.id }));
            toast.success("Login Successfully..");
            navigate("/home");
            setLoader(false);
          });
      })
      .catch((err) => {
        setLoader(false)
        toast.error(err.message);
      });
  };

  return (
    <div className="container" id="from_signup">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h2>Login</h2>
          <div className="card">
            <form onSubmit={handleSubmit(loginUser)}>
              <div>
                <label>Email</label>
                <br />
                <input
                  {...register("email")}
                  type="email"
                  className="f_input"
                />
                <span className="text text-danger">
                  {errors.email?.message}
                </span>
              </div>
              <div>
                <label>Password</label>
                <br />
                <input
                  {...register("password")}
                  type="password"
                  className="f_input"
                />
                <span className="text text-danger">
                  {errors.password?.message}
                </span>
              </div>

              <div>
                <button
                  type="submit"
                  className="f_register mt-4"
                  value="Register"
                  disabled={loader ? true : false}
                >
                  {loader && (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  )}
                  Login
                </button>
              </div>
              <div className="text-center mt-2">
                <Link to="/">Register Now</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
