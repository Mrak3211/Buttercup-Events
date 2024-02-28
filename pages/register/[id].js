import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useRouter } from "next/router";
import RegClosed from "../../components/RegClosed";
import ErrorPage from "../../components/ErrorPage";
import Loading from "../../components/Loading";
import supabase from "../../utils/supabase";
import { toast } from "react-toastify";

export async function getServerSideProps(context) {
  let { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", context.query.id);
  let Event = {};
  if (events) {
    Event = events[0];
  } else {
    console.log("No such document!");
  }
  return {
    props: { Event, error },
  };
}

const RegisterPage = ({ Event, error }) => {
  console.log("event", Event);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email } = registrationData;
    const { data, error } = await supabase
      .from("event_register")
      .insert([{ name, email, event_id: query.id }])
      .select();
    setLoading(false);
    if (data) {
      toast.success("Register Successfully");
      setSuccess(true);
      setRegistrationData({ name: "", email: "" });
    } else if (error) {
      toast.error(error.message);
      setSuccess(false);
    }
  };

  if (loading) {
    return <Loading title="Generating your ticket🤞🏼" />;
  }
  if (!Event?.title) {
    return <ErrorPage />;
  }

  if (Event.disableRegistration) {
    return <RegClosed event={Event} />;
  }

  return (
    <div>
      <Head>
        <title>{`${Event.title} | Buttercup Events`}</title>
        <meta
          name="description"
          content="An event ticketing system built with NextJS and Supabase"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex items-center justify-between min-h-[100vh] relative">
        <div className="md:w-[60%] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative">
          <h2 className="text-2xl font-medium mb-3">Get your ticket 🎉</h2>
          <form
            className="w-full flex flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <label htmlFor="name">Full name</label>
            <div className="w-full relative">
              <input
                type="text"
                name="name"
                value={registrationData.name}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    name: e.target.value,
                  })
                }
                className="border px-10 py-2 mb-3 rounded-md w-full"
                required
              />
              <FaUserAlt className=" absolute left-4 top-3 text-gray-300" />
            </div>

            <label htmlFor="email">Email address</label>
            <div className="w-full relative">
              <input
                type="email"
                name="email"
                value={registrationData.email}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    email: e.target.value,
                  })
                }
                className="border px-10 py-2 mb-3 rounded-md w-full"
                required
              />
              <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
            </div>
            <button
              type="submit"
              className="bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md"
            >
              GET TICKET
            </button>
          </form>
          <div className="absolute bottom-5 left-5">
            <p className="opacity-50 text-sm">
              <Link href="/">{Event.title}</Link> &copy; Copyright{" "}
              {new Date().getFullYear()}{" "}
            </p>
          </div>
        </div>
        <div className="login md:w-[40%] h-[100vh] relative">
          <div className="absolute bottom-5 right-5">
            <a
              href="https://github.com/mrak3211"
              target="_blank"
              className="text-gray-100"
            >
              Built by Ayush Chodvadiya
            </a>
          </div>
        </div>
        {success && (
          <div className="w-full h-[100vh] dim absolute top-0 flex items-center justify-center z-40">
            <div className="w-[400px] bg-white h-[300px] flex items-center justify-center flex-col rounded-md shadow-[#FFD95A] shadow-md">
              <h2 className="text-2xl font-extrabold mb-4 text-center">
                Registered Successfully! 🎉
              </h2>
              <p className="text-center mb-6">We Registered Your Information</p>
              <button
                className="px-4 py-2 bg-[#FFD95A] rounded-md"
                onClick={() => setSuccess(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default RegisterPage;
