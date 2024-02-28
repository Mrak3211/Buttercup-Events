import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { BsFillShareFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import ShareEventModal from "./ShareEventModal";
import supabase from "../utils/supabase";
import toast from "react-toastify";
import { convertTo12HourFormat } from "../utils/util";

const Events = ({ events }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="w-full flex flex-col items-center py-[60px] px-[20px]">
      <Link href="/create/event">
        <button className="bg-[#FFD95A] border-[1px] px-6 py-4 rounded-lg mb-4">
          Create an event ticket
        </button>
      </Link>
      <div className="w-full flex flex-wrap items-center justify-center">
        {events.map((event) => (
          <div
            className="md:w-[450px] w-full hover:shadow border-[1px] rounded-2xl m-3"
            key={event.id}
          >
            <div
              className="p-4 w-full cursor-pointer"
              onClick={() => router.push({ pathname: `/events/${event.id}` })}
            >
              <h2 className="text-xl font-medium mb-6">{event.title}</h2>
              <p className="opacity-80">
                {event.attendees
                  ? `${event.attendees} people registered`
                  : `No attendee yet`}
              </p>
              <p className="opacity-50">
                Time: {convertTo12HourFormat(event.time)}
              </p>
              <p className="opacity-50">Date: {event.date}</p>
              <p className="opacity-50">Venue: {event.venue}</p>
            </div>

            <div className="w-full py-6 bg-[#C07F00] rounded-b-2xl flex items-center px-4 justify-between">
              <MdDelete
                className="text-gray-200 text-2xl cursor-pointer"
                onClick={() => handleDelete(event.id)}
              />
              {!event.disableRegistration && (
                <BsFillShareFill
                  className="text-white text-xl cursor-pointer"
                  onClick={openModal}
                />
              )}
            </div>
            {showModal && (
              <ShareEventModal eventID={event.id} closeModal={closeModal} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
