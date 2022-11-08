import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";
import { Helmet } from "react-helmet";

function Home() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});

  const getBusesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const from = filters.from;
    const to = filters.to;
    const journeyDate = filters.journeyDate;
    try {
      const { data } = await axiosInstance.post(
        `/api/buses/get?from=${from}&to=${to}&journeyDate=${journeyDate}`
      );
      setBuses(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  }, [filters, dispatch]);

  const getBuses = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses");

      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    axiosInstance.get("/api/cities/get-all-cities").then((response) => {
      setCities(response.data.data);
    });
  }, []);

  useCallback(() => {
    if (filters.from && filters.to && filters.journeyDate) getBuses();
  }, [filters, getBuses]);

  useCallback(() => {
    if (filters.from && filters.to && filters.journeyDate) {
      getBusesByFilter();
    }
  }, [filters, getBusesByFilter]);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        <div className="full my-5 mx-2 p-2 px-2 py-3 flex justify-center">
          <Row gutter={10} align="center">
            <Col lg={12} sm={24}>
              <select
                className="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setFilters({ ...filters, from: e.target.value });
                }}
              >
                <option value="">From</option>
                {cities.map((data, index) => {
                  return (
                    <option key={index} value={data.ville}>
                      {data.ville}
                    </option>
                  );
                })}
              </select>
            </Col>
            <Col lg={12} sm={24}>
              <select
                className="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setFilters({ ...filters, to: e.target.value });
                }}
              >
                <option value="">To</option>
                {cities.map((data, index) => {
                  return (
                    <option key={index} value={data.ville}>
                      {data.ville}
                    </option>
                  );
                })}
              </select>
            </Col>
            <Col lg={24} sm={24}>
              <input
                className="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min={new Date().toISOString().split("T")[0]}
                type="date"
                placeholder="Date"
                onChange={(e) => {
                  setFilters({ ...filters, journeyDate: e.target.value });
                }}
              />
            </Col>
            <Col lg={8} sm={24}>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    getBusesByFilter();
                  }}
                  className="relative inline-flex items-center justify-start
                    px-10 py-3 overflow-hidden font-bold rounded-full
                    group"
                >
                  <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                  <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                  <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
                    Search
                  </span>
                  <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                </button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="z-20">
          <Row gutter={[15, 15]}>
            {buses
              .filter((bus) => {
                if (!filters.from && !filters.to && !filters.journeyDate) {
                  return (
                    bus.from === filters.from &&
                    bus.to === filters.to &&
                    bus.journeyDate === filters.journeyDate
                  );
                } else {
                  return bus;
                }
              })
              .map((bus, index) => {
                return (
                  <Col key={index} lg={24} sm={24}>
                    <Bus bus={bus} />
                  </Col>
                );
              })}
            {buses.length === 0 && (
              <div className="flex justify-center w-full">
                <h1 className="text-2xl font-bold text-gray-500">
                  No buses found
                </h1>
              </div>
            )}
          </Row>
        </div>
      </div>
  
    </>
  );
}

export default Home;
