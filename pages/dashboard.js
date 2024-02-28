import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import AuthNav from "../components/AuthNav";
import NoEvent from "../components/NoEvent";
import Events from "../components/Events";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import supabase from "../utils/supabase";

const dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = useCallback(async () => {
    if (localStorage.getItem("token")) {
      const user = (await supabase.auth.getUser())?.data?.user;
      setUser({ email: user?.email, id: user?.id });
      let { data: events, error } = await supabase.from("events").select("*");
      if (events) setEvents(events);
      console.error("error", error);
    } else {
      toast.warn("Please Login First!");
      return router.push("/login");
    }
  }, []);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  //   if (loading) return <Loading title="Your dashboard is almost ready.🍚" />;
  return (
    <div>
      <Head>
        <title>Dashboard | Buttercup Events</title>
        <meta
          name="description"
          content="An event ticketing system built with NextJS and Supabase"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthNav user={user} />
        {events.length > 0 ? <Events events={events} /> : <NoEvent />}
      </main>
    </div>
  );
};

export default dashboard;
