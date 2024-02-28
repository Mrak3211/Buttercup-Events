import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { MdCancel } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase";

const Event = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    note: "",
    flier: null,
  });
  const [buttonClicked, setButtonClicked] = useState(false);
  const router = useRouter();

  const isUserLoggedIn = useCallback(() => {
    if (!localStorage.getItem("token")) {
      toast.warn("Please Login First!");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select();
    if (data) {
      router.push("/dashboard");
    } else if (error) {
      console.error("error", error);
      toast.error("error", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileReader = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setEventData((prevData) => ({
        ...prevData,
        flier: readerEvent.target.result,
      }));
    };
  };

  return (
    <div>
      <Head>
        <title>Create New Event | Buttercup Events</title>
        <meta
          name="description"
          content="An event ticketing system built with NextJS and Supabase"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-6">Create a new event</h2>
          <Link href="/dashboard">
            <MdCancel className="text-4xl text-[#C07F00] cursor-pointer" />
          </Link>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            className="border-[1px] py-2 px-4 rounded-md mb-3"
            required
            value={eventData.title}
            onChange={handleInputChange}
          />
          <div className="w-full flex justify-between">
            <div className="w-1/2 flex flex-col mr-[20px]">
              <label htmlFor="date">Date</label>
              <input
                name="date"
                type="date"
                className="border-[1px] py-2 px-4 rounded-md mb-3"
                required
                value={eventData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <label htmlFor="time">Time</label>
              <input
                name="time"
                type="time"
                className="border-[1px] py-2 px-4 rounded-md mb-3"
                required
                value={eventData.time}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <label htmlFor="venue">Venue</label>
          <input
            name="venue"
            type="text"
            className="border-[1px] py-2 px-4 rounded-md mb-3"
            required
            value={eventData.venue}
            onChange={handleInputChange}
            placeholder="Plot Address, Lagos, Nigeria"
          />
          <label htmlFor="description">
            Event Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            name="description"
            rows={2}
            className="border-[1px] py-2 px-4 rounded-md mb-3"
            placeholder="Any information or details about the event"
            value={eventData.description}
            onChange={handleInputChange}
          />
          <label htmlFor="note">
            Note to Attendees <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            name="note"
            rows={2}
            value={eventData.note}
            onChange={handleInputChange}
            className="border-[1px] py-2 px-4 rounded-md mb-3"
            placeholder="Every attendee must take note of this"
          />
          <label htmlFor="flier">
            Event Flier <span className="text-gray-500">(optional)</span>
          </label>
          <input
            name="flier"
            type="file"
            className="border-[1px] py-2 px-4 rounded-md mb-3"
            accept="image/*"
            onChange={handleFileReader}
          />
          {/* {buttonClicked ? (
            <Loading title="May take longer time for image uploads" />
          ) : ( */}
          <button className="px-4 py-2 bg-[#C07F00] w-[200px] mt-3 text-white rounded-md">
            Create Event
          </button>
          {/* )} */}
        </form>
      </main>
    </div>
  );
};

export default Event;
