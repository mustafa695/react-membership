import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";

const Admin = () => {
  const [paymentData, setPaymentData] = useState([]);
  useEffect(() => {
    let temp = [];
    db.collection("payment")
      .get()
      .then((res) => {
        res.docs.map((i) => {
          temp.push(i.data());
        });
        setPaymentData(temp);
      });
  }, []);
  return (
    <div className="row" id="admin">
      <div className="col-lg-3 col-md-4" style={{ position: "relative" }}>
        <div className="sidemenu">
          <h3>Admin Dashboard</h3>
          <li>
            <a>Payments</a>
          </li>
        </div>
      </div>
      <div className="col-lg-9 col-md-8">
        <div className="card">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Pay Fee</th>
                  <th>Deduct Fee</th>
                  <th>Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentData?.map((data) => {
                  return (
                    <tr>
                      <td>{data?.payerName}</td>
                      <td>{data?.fee}</td>
                      <td>{data?.deduct}</td>
                      <td>{data?.payDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
