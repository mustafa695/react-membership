import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../config/firebase";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUserData } from "../store/action";
import { useDispatch } from "react-redux";
const schema = yup
  .object({
    names: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    cardnumb: yup.string().required(),
    expiry: yup.string().required(),
    cvv: yup.string().required(),
  })
  .required();

const Signup = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [l2Data, setL2Data] = useState([]);
  const [l3Data, setL3Data] = useState([]);
  const [l4Data, setL4Data] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const location = useLocation();
  let getrefID = location.pathname.length && location.pathname?.split("/")[2];
 
  useEffect(() => {
    if (getrefID?.length > 1) {
      db.collection("users")
        .doc(getrefID)
        .get()
        .then((res) => {
          if (res.data()) {
            setUsersData(res.data());
          }
          else{
            navigate("/")
          }
        })
        .catch((err) => console.log(err));
      if (usersData.joinRefId != undefined) {
        let jid = usersData?.joinRefId;
        db.collection("users")
          .doc(jid)
          .get()
          .then((res) => {
            setL2Data(res.data());
            if (res.data().joinRefId) {
              db.collection("users")
                .doc(res.data().joinRefId)
                .get()
                .then((res) => {
                  setL3Data(res.data());
                  if (res.data().joinRefId) {
                    db.collection("users")
                      .doc(res.data().joinRefId)
                      .get()
                      .then((res) => {
                        setL4Data(res.data());
                      })
                      .catch((err) => console.log(err));
                  }
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (usersData == undefined) {
        navigate("/");
      }
    }
  }, [getrefID, usersData?.joinRefId]);

  const cardNumberLength = (e) => {
    if (e.length >= 16) {
      return false;
    }
    setCardNumber(e);
  };

  const expiryLength = (e) => {
    if (e.length > 4) {
      return false;
    }
    setExpiry(e);
  };

  const cvvLenght = (e) => {
    if (e.length > 4) {
      return false;
    }
    setCvv(e);
  };

  const signup = (data) => {
    const d = new Date();
    let date = d.toDateString();
    setLoader(true);
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((userCredential) => {
        // Signed in
        let fee = 100;
        let deducted = 0;
        if (getrefID?.length > 1) {
          if (l2Data.uid && l3Data.uid && l4Data.uid) {
            deducted = (fee / 100) * 36;
            fee = fee - deducted;
          } else if (l2Data.uid && l3Data.uid) {
            deducted = (fee / 100) * 35;
            fee = fee - deducted;
          } else if (l2Data.uid) {
            deducted = (fee / 100) * 30;
            fee = fee - deducted;
          } else if (!l2Data.uid && !l3Data.uid && !l4Data.uid) {
            deducted = (fee / 100) * 20;
            fee = fee - deducted;
          }
        }

        let user = userCredential.user;
        let docId = user?.uid;

        let input = {
          name: data.names,
          email: data.email,
          cardnumb: data.cardnumb,
          expiry: data.expiry,
          cvv: data.cvv,
          refId: `http://localhost:3000/signupWithReferId/${docId}`,
          feePay: `$100`,
          credit: 0,
          uid: docId,
          joinRefId: getrefID?.length ? getrefID : null,
        };
        db.collection("users")
          .doc(docId)
          .set(input)
          .then((res) => {
            db.collection("users")
              .doc(docId)
              .get()
              .then((doc) => {
                dispatch(loginUserData({ ...doc.data(), id: doc.id }));

                let payInput = {
                  fee: `$${fee}`,
                  payerName: data.names,
                  deduct: `${deducted}$`,
                  referName: usersData?.name ? usersData?.name : null,
                  referId: usersData?.uid ? usersData?.uid : null,
                  payDate: date,
                  payerId: docId,
                };
                db.collection("payment")
                  .doc(docId)
                  .set(payInput)
                  .then((res) => {
                    if (getrefID?.length > 1) {
                      let crd = (100 / 100) * 20;

                      db.collection("users")
                        .doc(usersData?.uid)
                        .update({
                          credit: usersData?.credit + crd,
                        })
                        .then((res) => {
                          if (l2Data.uid) {
                            let crd = (100 / 100) * 10;

                            db.collection("users")
                              .doc(l2Data.uid)
                              .update({
                                credit: l2Data.credit + crd,
                              })
                              .then((upd1) => {
                                if (l3Data.uid) {
                                  let crd = (100 / 100) * 5;

                                  db.collection("users")
                                    .doc(l3Data.uid)
                                    .update({
                                      credit: l3Data?.credit + crd,
                                    })
                                    .then((res) => {
                                      if (l4Data.uid) {
                                        let crd = (100 / 100) * 1;

                                        db.collection("users")
                                          .doc(l4Data.uid)
                                          .update({
                                            credit: l4Data?.credit + crd,
                                          })
                                          .then((upd2) => {
                                            navigate("/home");
                                            toast.success(
                                              "Signup Successfully..."
                                            );
                                            setLoader(false);
                                          });
                                      } else {
                                        navigate("/home");
                                        toast.success("Signup Successfully...");
                                        setLoader(false);
                                      }
                                    })
                                    .catch((err) => console.log(err));
                                } else {
                                  navigate("/home");
                                  toast.success("Signup Successfully...");
                                  setLoader(false);
                                }
                              })
                              .catch((err) => console.log(err));
                          } else {
                            navigate("/home");
                            toast.success("Signup Successfully...");
                            setLoader(false);
                          }
                        })
                        .catch((err) => console.log(err));
                    } else {
                      navigate("/home");
                      toast.success("Signup Successfully...");
                      setLoader(false);
                    }
                  });
              });
          })
          .catch((err) => {
            setLoader(false);
            console.log(err, console.log(err));
          });
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };
  return (
    <div className="container" id="from_signup">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h2>Signup</h2>
          <div className="card">
            <form onSubmit={handleSubmit(signup)}>
              <div>
                <label>Name</label>
                <br />
                <input {...register("names")} type="text" className="f_input" />
                <span className="text text-danger">
                  {errors.names?.message}
                </span>
                <br />
              </div>
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
              <h4 className="my-3">Payment Fee</h4>
              <div>
                <label>Enter Card Number</label>
                <br />
                <input
                  {...register("cardnumb")}
                  type="number"
                  className="f_inputed w-100"
                  value={cardNumber}
                  onChange={(e) => cardNumberLength(e.target.value)}
                />
                <span className="text text-danger">
                  {errors.cardnumb?.message}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <div style={{ flex: "1" }}>
                  <label>Expiry</label>
                  <br />
                  <input
                    {...register("expiry")}
                    type="number"
                    className="f_inputed"
                    value={expiry}
                    onChange={(e) => expiryLength(e.target.value)}
                  />
                  <span className="text text-danger">
                    {errors.expiry?.message}
                  </span>
                </div>
                <div style={{ flex: "1" }}>
                  <label>CVV/CVC</label>
                  <br />
                  <input
                    {...register("cvv")}
                    type="number"
                    className="f_inputed"
                    value={cvv}
                    onChange={(e) => cvvLenght(e.target.value)}
                  />
                  <span className="text text-danger">
                    {errors.cvv?.message}
                  </span>
                </div>
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
                  SignUp
                </button>
              </div>
              <div className="text-center mt-2">
                <Link to="/login">I have an account! Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
